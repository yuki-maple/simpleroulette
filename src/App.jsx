import { useEffect, useMemo, useRef, useState } from "react";
import RouletteWheel from "./components/RouletteWheel";
import ItemEditor from "./components/ItemEditor";
import Footer from "./components/Footer";
import { getDefaultColor } from "./utils/colors";
import { translations } from "./utils/i18n";
import {
  calculateSpinTarget,
  createId,
  getRenderableItems,
  getSegments,
  getValidationError,
  randomIndex,
} from "./utils/roulette";

const SPIN_DURATION_MS = 4600;

function detectInitialLang() {
  const lang = navigator.language || (navigator.languages && navigator.languages[0]) || "ja";
  return lang.startsWith("ja") ? "ja" : "en";
}

export default function App() {
  const [lang, setLang] = useState(detectInitialLang);
  const t = translations[lang];

  function createInitialItems() {
    return [
      { id: createId(), label: t.defaultOptionPrefix + "1", color: getDefaultColor(0) },
      { id: createId(), label: t.defaultOptionPrefix + "2", color: getDefaultColor(1) },
      { id: createId(), label: t.defaultOptionPrefix + "3", color: getDefaultColor(2) },
    ];
  }

  const [items, setItems] = useState(createInitialItems);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");

  const spinTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    return () => {
      if (spinTimerRef.current) {
        clearTimeout(spinTimerRef.current);
      }
    };
  }, []);

  const validationMessage = useMemo(() => getValidationError(items, t), [items, t]);
  const canSpin = !spinning && !validationMessage;

  const renderableItems = useMemo(
    () => getRenderableItems(items),
    [items]
  );

  function handleAddItem() {
    setItems((prev) => [
      ...prev,
      {
        id: createId(),
        label: t.defaultOptionPrefix + (prev.length + 1),
        color: getDefaultColor(prev.length),
      },
    ]);
  }

  function handleUpdateItem(id, field, value) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function handleDeleteItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleSpin() {
    if (!canSpin) return;

    setSpinning(true);
    setResult("");

    const winnerIndex = randomIndex(renderableItems.length);
    const segments = getSegments(renderableItems);
    const winnerSegment = segments[winnerIndex];

    const nextRotation = calculateSpinTarget(rotation, winnerSegment, 6);
    setRotation(nextRotation);

    spinTimerRef.current = setTimeout(() => {
      setSpinning(false);
      setResult(winnerSegment.label);
    }, SPIN_DURATION_MS);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-content">
          <div>
            <h1>{t.appTitle}</h1>
            <p>{t.appDesc}</p>
          </div>
          <div className="lang-switcher" role="group" aria-label="Language">
            <button
              className={"lang-btn" + (lang === "ja" ? " lang-btn--active" : "")}
              onClick={() => setLang("ja")}
            >
              JP
            </button>
            <button
              className={"lang-btn" + (lang === "en" ? " lang-btn--active" : "")}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main className="app-grid">
        <div className="left-column">
          <RouletteWheel
            items={renderableItems}
            rotation={rotation}
            spinning={spinning}
            result={result}
            onSpin={handleSpin}
            disabled={!canSpin}
            t={t}
          />
        </div>

        <div className="right-column">
          <ItemEditor
            items={items}
            onAdd={handleAddItem}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
            validationMessage={validationMessage}
            t={t}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

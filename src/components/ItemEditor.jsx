import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function ItemEditor({ items, onAdd, onUpdate, onDelete, validationMessage, t }) {
  const [parent] = useAutoAnimate();

  return (
    <section className="panel">
      <div className="section-header">
        <h2>{t.itemSettingsTitle}</h2>
        <button className="secondary-button" onClick={onAdd}>
          {t.itemAddBtn}
        </button>
      </div>

      <div className="helper-text">{t.itemHelperText}</div>

      {validationMessage ? (
        <div className="error-box">{validationMessage}</div>
      ) : null}

      <div className="item-list" ref={parent}>
        {items.length === 0 ? (
          <div className="empty-box">{t.itemEmpty}</div>
        ) : (
          items.map((item, index) => (
            <div className="item-row" key={item.id}>
              <div className="item-number">{index + 1}</div>

              <div className="item-input-group">
                <input
                  className="color-input"
                  type="color"
                  value={item.color}
                  onChange={(e) => onUpdate(item.id, "color", e.target.value)}
                />
                <input
                  className="text-input"
                  type="text"
                  placeholder={t.itemPlaceholder}
                  value={item.label}
                  onChange={(e) => onUpdate(item.id, "label", e.target.value)}
                />
              </div>

              <button className="danger-button" onClick={() => onDelete(item.id)}>
                {t.itemDelete}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
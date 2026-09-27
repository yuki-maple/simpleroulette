export function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export function getValidationError(items, t) {
  if (items.length === 0) {
    return t.errorEmptyItems;
  }

  return items.some((item) => !item.label.trim()) ? t.errorEmptyLabel : "";
}

export function getRenderableItems(items) {
  return items
    .map((item) => ({
      ...item,
      label: item.label.trim(),
    }))
    .filter((item) => item.label);
}

export function getSegments(items) {
  const angle = 360 / items.length;
  return items.map((item, index) => {
    const startAngle = index * angle;
    return {
      ...item,
      startAngle,
      endAngle: startAngle + angle,
      middleAngle: startAngle + angle / 2,
    };
  });
}

export function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

export function calculateSpinTarget(currentRotation, winnerSegment, extraTurns = 6) {
  const normalizedRotation = ((currentRotation % 360) + 360) % 360;

  const desiredRotation = (360 - winnerSegment.middleAngle) % 360;
  const delta = (desiredRotation - normalizedRotation + 360) % 360;

  return currentRotation + extraTurns * 360 + delta;
}

// Ramer–Douglas–Peucker, points are [x, y] in page pixels
const simplify = (points, epsilon) => {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const length = Math.hypot(bx - ax, by - ay) || 1;
  let maxDistance = 0;
  let maxIndex = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const distance = Math.abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) / length;
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }
  if (maxDistance > epsilon) {
    const left = simplify(points.slice(0, maxIndex + 1), epsilon);
    const right = simplify(points.slice(maxIndex), epsilon);
    return [...left.slice(0, -1), ...right];
  } else {
    return [points[0], points[points.length - 1]];
  }
};

// text lines of a page as { x0, x1, yCenter, height } in fractions of the page's width/height
const getTextLines = async (pdfjs, pdfPage) => {
  const viewport = pdfPage.getViewport({ scale: 1 });
  const textContent = await pdfPage.getTextContent();
  return textContent.items
    .filter((item) => item.str && item.str.trim() && item.width > 0)
    .map((item) => {
      const tx = pdfjs.Util.transform(viewport.transform, item.transform);
      const fontHeight = Math.hypot(tx[2], tx[3]);
      return {
        x0:      tx[4] / viewport.width,
        x1:      (tx[4] + item.width * viewport.scale) / viewport.width,
        yCenter: (tx[5] - fontHeight * 0.32) / viewport.height,
        height:  fontHeight / viewport.height
      };
    })
    .filter((line) => line.height > 0 && line.height < 0.2);
};

// turns raw pointer points (page pixels) into a stored highlight: a straight marker line if the hand went mostly sideways, snapped onto the text line underneath when there is one
const pointsToHighlight = (rawPoints, pageWidth, pageHeight, textLines, defaultWidth) => {
  const xs = rawPoints.map((p) => p[0]);
  const ys = rawPoints.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const dx = maxX - minX;
  const dy = maxY - minY;

  if (dx < 4 && dy < 4) return null;

  const ifStraight = dy < Math.max(14, dx * 0.22);
  if (ifStraight) {
    const meanY = ys.reduce((a, b) => a + b, 0) / ys.length / pageHeight;
    const x0 = minX / pageWidth;
    const x1 = maxX / pageWidth;
    const candidates = (textLines || []).filter((line) =>
      Math.abs(line.yCenter - meanY) < line.height * 0.9 &&
      line.x0 < x1 && line.x1 > x0
    );
    let y = meanY;
    let width = defaultWidth;
    if (candidates.length > 0) {
      const closest = candidates.reduce((best, line) =>
        (Math.abs(line.yCenter - meanY) < Math.abs(best.yCenter - meanY) ? line : best)
      );
      y = closest.yCenter;
      width = closest.height * 1.35;
    }
    return { points: [[x0, y], [x1, y]], width };
  } else {
    const simplified = simplify(rawPoints, 1.5);
    return {
      points: simplified.map(([x, y]) => [x / pageWidth, y / pageHeight]),
      width: defaultWidth
    };
  }
};

const highlightToPathD = (points, viewWidth, viewHeight) =>
  points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${(x * viewWidth).toFixed(1)} ${(y * viewHeight).toFixed(1)}`).join(' ');

export { simplify, getTextLines, pointsToHighlight, highlightToPathD };
export default { simplify, getTextLines, pointsToHighlight, highlightToPathD };

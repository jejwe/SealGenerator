// seal-generator/src/utils/sealGenerator.js

const DEG_TO_RAD = Math.PI / 180;

/**
 * Draws a simple star (for Canvas).
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} cx - Center x.
 * @param {number} cy - Center y.
 * @param {number} spikes - Number of spikes.
 * @param {number} outerRadius - Outer radius.
 * @param {number} innerRadius - Inner radius.
 * @param {string} color - Fill color.
 */
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws the seal on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {object} config - The seal configuration object.
 */
export function drawSeal(ctx, config) {
  // console.log('Drawing seal with config:', config);
  const sealSize = config.sealSize || 200;
  // const margin = config.margin || 0; 
  const canvasSize = sealSize; 
  const center = canvasSize / 2;
  const color = config.color || '#FF0000';

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = config.borderWidth || 5;
  const opacityValue = (config.opacity || 100) / 100; // Convert percentage to 0-1
  ctx.globalAlpha = opacityValue;


  if (!config.noWhiteBackground) {
    ctx.save();
    ctx.globalAlpha = 1; // Ensure background is fully opaque if drawn
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.restore();
     // Re-apply configured opacity for subsequent drawing
    ctx.globalAlpha = opacityValue;
  }


  // --- Outer Border ---
  if (config.borderWidth > 0) {
    ctx.beginPath();
    ctx.arc(center, center, (sealSize - config.borderWidth) / 2, 0, 2 * Math.PI);
    ctx.stroke();
  }

  let textRadius = (sealSize - config.borderWidth) / 2 - (config.ringPadding || 0);
  textRadius = Math.max(0, textRadius); // Ensure radius is not negative

  // --- Company Name (chara - Top Arc) ---
  if (config.companyName && config.companyName.length > 0) {
    const companyName = config.companyName;
    const fontSize = config.fontSize || 24; 
    // const fontHeightPercent = config.fontHeight || 150; 
    const characterSpacingFactor = config.characterSpacing || 0; // Use as a direct pixel adjustment for now

    const actualFontSize = fontSize * (sealSize / 160); // Scale font size with seal size (baseline 160px seal)
    ctx.font = `${actualFontSize}px ${config.font || 'SimSun'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const availableAngle = 160; // Max angle for text (e.g. 180 for full semi-circle, less for typical seals)
    const numChars = companyName.length;
    let anglePerChar = numChars > 1 ? availableAngle / numChars : 0;
    
    // Adjust spacing - positive characterSpacing increases gap, negative decreases
    // This is an approximation. True kerning/spacing on arc is complex.
    const totalAngleSpread = (anglePerChar * (numChars -1)) + (characterSpacingFactor * (numChars-1) * (actualFontSize/textRadius) * (180/Math.PI) * 0.1);
    const startAngle = -90 - (totalAngleSpread / 2);


    for (let i = 0; i < numChars; i++) {
      const char = companyName[i];
      const currentAngle = startAngle + i * (totalAngleSpread / (numChars > 1 ? (numChars -1) : 1) / (anglePerChar/anglePerChar)); // Distribute along the adjusted spread
      const angleRad = currentAngle * DEG_TO_RAD;
      
      const charX = center + Math.cos(angleRad) * (textRadius - actualFontSize * 0.7); // Pull text inwards a bit more
      const charY = center + Math.sin(angleRad) * (textRadius - actualFontSize * 0.7);

      ctx.save();
      ctx.translate(charX, charY);
      ctx.rotate(angleRad + 90 * DEG_TO_RAD); 
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }

  // --- Seal Name (charb - Center) ---
  if (config.sealName && config.sealName.length > 0) {
    const sealName = config.sealName;
    const actualFontSize = (config.fontSize || 24) * 0.8 * (sealSize / 160); 
    ctx.font = `${actualFontSize}px ${config.font || 'SimSun'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const yOffset = center + (sealSize * ( (120 - 80) / 160) ); // Adjusted y-position
    ctx.fillText(sealName, center, yOffset);
  }
  
  // --- Code (charc - Bottom Arc) ---
  if (config.code && config.code.length > 0) {
    const code = config.code;
    const actualFontSize = (config.fontSize || 24) * 0.5 * (sealSize / 160);
    ctx.font = `${actualFontSize}px ${config.font || 'SimSun'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const availableAngle = 100;
    const numChars = code.length;
    let anglePerChar = numChars > 1 ? availableAngle / numChars : 0;
    // No characterSpacing adjustment for code for simplicity for now

    const totalAngleSpread = anglePerChar * (numChars -1) ;
    const startAngle = 90 - (totalAngleSpread / 2) ;

    for (let i = 0; i < numChars; i++) {
      const char = code[i];
      const currentAngle = startAngle + i * (totalAngleSpread / (numChars > 1 ? (numChars -1) : 1) / (anglePerChar/anglePerChar));
      const angleRad = currentAngle * DEG_TO_RAD;
      
      const charX = center + Math.cos(angleRad) * (textRadius - actualFontSize * 0.7);
      const charY = center + Math.sin(angleRad) * (textRadius - actualFontSize * 0.7);

      ctx.save();
      ctx.translate(charX, charY);
      ctx.rotate(angleRad - 90 * DEG_TO_RAD); 
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }

  // --- Center Mark (sign) ---
  if (config.centerMark && config.centerMark !== 'none') {
    const signScaleFactor = (config.signScale || 100) / 100; 
    const baseStarOuterRadius = sealSize * (20 / 160); // Star size relative to seal size
    const starOuterRadius = baseStarOuterRadius * signScaleFactor;
    const starInnerRadius = starOuterRadius / 2;

    if (config.centerMark === 'star') {
      drawStar(ctx, center, center, 5, starOuterRadius, starInnerRadius, color);
    }
    if (config.centerMark === 'party') {
      // Placeholder for Party Emblem - a simple filled circle with "党"
      ctx.beginPath();
      ctx.arc(center, center, starOuterRadius * 0.8, 0, 2 * Math.PI);
      ctx.fillStyle = color; // Use seal color for the emblem background
      ctx.fill();
      
      ctx.save(); // Save current state before changing fillStyle for text
      ctx.fillStyle = config.noWhiteBackground ? '#FFFFFF' : '#FFFFFF'; // White text for emblem
      const emblemFontSize = starOuterRadius * 0.8; // Scale font size with star size
      ctx.font = `bold ${emblemFontSize}px ${config.font || 'SimSun'}`; // Make it bold
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("党", center, center);
      ctx.restore(); // Restore fillStyle
    }
  }
  
  ctx.globalAlpha = 1.0; // Reset global alpha
  // console.log('Seal drawing finished.');
}


/**
 * Generates an SVG string for the seal.
 * @param {object} config - The seal configuration object.
 * @returns {string} - The SVG string.
 */
export function generateSealSvg(config) {
  const sealSize = config.sealSize || 200;
  const center = sealSize / 2;
  const color = config.color || '#FF0000';
  const borderWidth = config.borderWidth || 5;
  const opacityValue = (config.opacity || 100) / 100;

  let svgElements = [];

  // Background
  if (!config.noWhiteBackground) {
    svgElements.push(`<rect x="0" y="0" width="${sealSize}" height="${sealSize}" fill="#FFFFFF" />`);
  }

  // Start group for overall transform (rotation, opacity)
  svgElements.push(`<g transform="rotate(${config.rotation || 0} ${center} ${center})" opacity="${opacityValue}">`);

  // Outer Border
  if (borderWidth > 0) {
    const radius = (sealSize - borderWidth) / 2;
    svgElements.push(`<circle cx="${center}" cy="${center}" r="${radius}" stroke="${color}" stroke-width="${borderWidth}" fill="transparent" />`);
  }

  const textRadius = (sealSize - borderWidth) / 2 - (config.ringPadding || 0);

  // Company Name (Top Arc)
  if (config.companyName && config.companyName.length > 0) {
    const companyName = config.companyName;
    const actualFontSize = (config.fontSize || 24) * (sealSize / 160);
    const charSpacing = config.characterSpacing || 0; // Approximate letter-spacing

    // Define a path for the top arc
    const topArcId = "topArcPath";
    // Path: M(start) A(rx ry x-axis-rotation large-arc-flag sweep-flag x y)
    // For top arc, sweep-flag is 0 (counter-clockwise) or 1 (clockwise) depending on start
    // A common way is to start from left-ish to right-ish for top arc
    const pathStartX = center - textRadius * Math.cos(70 * DEG_TO_RAD); // e.g., -70 deg from top
    const pathStartY = center - textRadius * Math.sin(70 * DEG_TO_RAD);
    const pathEndX = center + textRadius * Math.cos(70 * DEG_TO_RAD); // e.g., +70 deg from top
    const pathEndY = center - textRadius * Math.sin(70 * DEG_TO_RAD);

    // Make path slightly less than a full semi-circle to avoid text bunching at ends
    // Adjusted angles for a wider, more typical company arc (e.g., 220-240 degrees total sweep)
    const angleSpreadCompany = 100; // degrees from vertical on each side
    const startAngleCompany = -90 - angleSpreadCompany/2;
    const endAngleCompany = -90 + angleSpreadCompany/2;

    const arcStartX = center + textRadius * Math.cos(startAngleCompany * DEG_TO_RAD);
    const arcStartY = center + textRadius * Math.sin(startAngleCompany * DEG_TO_RAD);
    const arcEndX = center + textRadius * Math.cos(endAngleCompany * DEG_TO_RAD);
    const arcEndY = center + textRadius * Math.sin(endAngleCompany * DEG_TO_RAD);
    
    // Large arc flag should be 0 if spread < 180, 1 if spread >= 180.
    // Sweep flag 1 for typical top text path from left to right along top.
    svgElements.push(`<path id="${topArcId}" d="M ${arcStartX} ${arcStartY} A ${textRadius} ${textRadius} 0 ${angleSpreadCompany > 180 ? 1 : 0} 1 ${arcEndX} ${arcEndY}" fill="none" stroke="none"/>`);
    svgElements.push(
      `<text font-family="${config.font || 'SimSun'}" font-size="${actualFontSize}px" fill="${color}" letter-spacing="${charSpacing}" text-anchor="middle">` +
      `<textPath xlink:href="#${topArcId}" startOffset="50%">${companyName}</textPath>` +
      `</text>`
    );
  }

  // Seal Name (Center)
  if (config.sealName && config.sealName.length > 0) {
    const sealName = config.sealName;
    const actualFontSize = (config.fontSize || 24) * 0.8 * (sealSize / 160);
    const yOffset = center + (sealSize * ((120 - 80) / 160)); // Match canvas logic
    svgElements.push(
      `<text x="${center}" y="${yOffset}" font-family="${config.font || 'SimSun'}" font-size="${actualFontSize}px" fill="${color}" text-anchor="middle" dominant-baseline="middle">${sealName}</text>`
    );
  }

  // Code (Bottom Arc)
  if (config.code && config.code.length > 0) {
    const code = config.code;
    const actualFontSize = (config.fontSize || 24) * 0.5 * (sealSize / 160);
    const bottomArcId = "bottomArcPath";

    // Path for bottom arc (reads left to right, characters upright)
    // Sweep flag 0 to draw the "upper" part of the circle segment at the bottom.
    const angleSpreadCode = 70; // Degrees from vertical on each side for the code text
    const startAngleCode = 90 - angleSpreadCode/2;
    const endAngleCode = 90 + angleSpreadCode/2;

    const arcStartX_B = center + textRadius * Math.cos(startAngleCode * DEG_TO_RAD);
    const arcStartY_B = center + textRadius * Math.sin(startAngleCode * DEG_TO_RAD);
    const arcEndX_B = center + textRadius * Math.cos(endAngleCode * DEG_TO_RAD);
    const arcEndY_B = center + textRadius * Math.sin(endAngleCode * DEG_TO_RAD);

    svgElements.push(`<path id="${bottomArcId}" d="M ${arcStartX_B} ${arcStartY_B} A ${textRadius} ${textRadius} 0 ${angleSpreadCode > 180 ? 1 : 0} 1 ${arcEndX_B} ${arcEndY_B}" fill="none" stroke="none"/>`);
    svgElements.push(
      `<text font-family="${config.font || 'SimSun'}" font-size="${actualFontSize}px" fill="${color}" text-anchor="middle">` +
      `<textPath xlink:href="#${bottomArcId}" startOffset="50%">${code}</textPath>` +
      `</text>`
    );
  }


  // Center Mark (Star)
  if (config.centerMark === 'star') {
    const signScaleFactor = (config.signScale || 100) / 100;
    const baseStarOuterRadius = sealSize * (20 / 160);
    const outerR = baseStarOuterRadius * signScaleFactor;
    const innerR = outerR / 2;
    let points = "";
    for (let i = 0; i < 5; i++) {
      points += `${center + outerR * Math.cos(2 * Math.PI * i / 5 - Math.PI / 2)},${center + outerR * Math.sin(2 * Math.PI * i / 5 - Math.PI / 2)} `;
      points += `${center + innerR * Math.cos(2 * Math.PI * (i + 0.5) / 5 - Math.PI / 2)},${center + innerR * Math.sin(2 * Math.PI * (i + 0.5) / 5 - Math.PI / 2)} `;
    }
    svgElements.push(`<polygon points="${points}" fill="${color}" />`);
  } else if (config.centerMark === 'party') {
    const signScaleFactor = (config.signScale || 100) / 100;
    const baseRadius = sealSize * (20 / 160);
    const emblemRadius = baseRadius * signScaleFactor * 0.8;
    const emblemFontSize = emblemRadius * 0.8; // Scaled font size

    svgElements.push(`<circle cx="${center}" cy="${center}" r="${emblemRadius}" fill="${color}" />`);
    svgElements.push(
        `<text x="${center}" y="${center}" font-family="${config.font || 'SimSun'}" font-size="${emblemFontSize}px" font-weight="bold" fill="${config.noWhiteBackground ? '#FFFFFF' : '#FFFFFF'}" text-anchor="middle" dominant-baseline="middle">党</text>`
    );
  }


  svgElements.push(`</g>`); // End group for overall transform

  return `<svg width="${sealSize}" height="${sealSize}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${svgElements.join('')}</svg>`;
}

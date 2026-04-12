export async function exportToImage(elementId, filename) {
  return new Promise((resolve, reject) => {
    if (window.html2canvas) {
      capture(window.html2canvas);
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.onload = () => capture(window.html2canvas);
      script.onerror = reject;
      document.body.appendChild(script);
    }

    function capture(html2canvas) {
      const element = document.getElementById(elementId);
      if (!element) return reject(new Error("Element not found"));

      // Temporarily store original styles
      const originalBackground = element.style.background;
      const originalBorderRadius = element.style.borderRadius;

      // Apply solid styling for reliable canvas rendering
      // Canvas struggles with backdrop-filter blurs, so a solid color acts as the fallback
      element.style.background = "#131b2e";
      element.style.borderRadius = "0px";

      html2canvas(element, {
        useCORS: true,
        scale: 2, // High resolution
        backgroundColor: "#131b2e",
        ignoreElements: (node) => node.classList && node.classList.contains('no-export')
      })
        .then((canvas) => {
          // Restore styles
          element.style.background = originalBackground;
          element.style.borderRadius = originalBorderRadius;

          // Trigger download
          const link = document.createElement("a");
          link.download = `${filename.replace(/\s+/g, "_").toLowerCase()}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          resolve();
        })
        .catch((err) => {
          element.style.background = originalBackground;
          element.style.borderRadius = originalBorderRadius;
          reject(err);
        });
    }
  });
}

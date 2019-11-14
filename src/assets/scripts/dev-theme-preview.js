if (window.location.href.indexOf('localhost') > -1 || true) {
  const findiFrame = () => {
    const previewBarIFrame = document.getElementById('preview-bar-iframe');
    if (!previewBarIFrame) {
      window.requestAnimationFrame(findiFrame);
    } else {
      const findIframeContent = () => {
        const iFrame = previewBarIFrame.contentDocument || previewBarIFrame.contentWindow.document;
        const previewMessageEl = iFrame.getElementsByTagName('p')[0];
        const shareUrlInput = iFrame.getElementById('share_theme_url');
        if (!previewMessageEl || !shareUrlInput) {
          window.requestAnimationFrame(findIframeContent);
        } else {
          previewBarIFrame.remove();
          document.documentElement.style = '';
          console.info(`%c${previewMessageEl.innerText.trim()}`, 'color: white; background-color: blueviolet; padding: 6px;');
          console.info(`%cShare URL: ${shareUrlInput.value}`, 'color: blueviolet;');
        }
      };
      findIframeContent();
    }
  };
  findiFrame();
}

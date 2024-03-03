document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll("[data-spoiler]");

  if (dropdowns) {
    for (const item of dropdowns) {
      const btn = item.querySelector("[spoiler-btn]");
      const content = item.querySelector("[spoiler-body]");

      btn.addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("open");

        function openSpoiler() {
          content.style.maxHeight = `${content.scrollHeight}px`;
        }

        function closeSpoiler() {
          content.style.maxHeight = null;
        }

        e.currentTarget.classList.contains("open")
          ? openSpoiler()
          : closeSpoiler();

        e.preventDefault();

        document.addEventListener("click", (e) => {
          const withinBoundaries = e.composedPath().includes(item);
          if (!withinBoundaries) {
            btn.classList.remove("open");
            closeSpoiler();
          }
        });
      });
    }
  }
});

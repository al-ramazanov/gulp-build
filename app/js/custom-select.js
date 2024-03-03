/* All select tags most be a wrapped in ".select-wrap calss in html"  */

const selectWrappers = document.querySelectorAll(".select-wrap");
/* Find all "select-wrap's" */

for (let el of selectWrappers) {
  let select = el.querySelector("select");

  if (select) {
    select.style.display = "none";

    function createClassedElement(tag, className) {
      const newElem = document.createElement(tag);
      newElem.classList.add(className);
      return newElem;
    }

    const customSelect = createClassedElement("div", "custom-select");

    const customSelectHeader = createClassedElement(
      "button",
      "custom-select__header"
    );
    customSelectHeader.type = "button";
    const customSelectContent = createClassedElement(
      "div",
      "custom-select__content"
    );

    customSelect.append(customSelectHeader);

    customSelect.append(customSelectContent);

    el.append(customSelect);

    for (let i = 0; i < select.options.length; i++) {
      customSelectHeader.innerText =
        select.options[select.options.selectedIndex].text;
      customSelectContent.insertAdjacentHTML(
        "beforeend",
        `<button type="button" class="custom-select__item">${select.options[i].text}</button >`
      );
    }

    customSelect.addEventListener("click", (e) => {
      customSelect.classList.toggle("open");
      if (customSelect.classList.contains("open")) {
        customSelectContent.style.maxHeight = `${customSelectContent.scrollHeight}px`;
        customSelectHeader.classList.add("open");
      } else {
        customSelectContent.style.maxHeight = null;
        customSelectHeader.classList.remove("open");
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target !== customSelectHeader) {
        customSelectContent.style.maxHeight = null;
        customSelectHeader.classList.remove("open");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        customSelectContent.style.maxHeight = null;
        customSelectHeader.classList.remove("open");
      }
    });
  }

  const customSelectItems = el.querySelectorAll(".custom-select__item");

  for (let el of customSelectItems) {
    el.addEventListener("click", () => {
      const header = el.parentElement.previousSibling;
      select.value = el.innerText;
      header.innerText = select.value;
    });
  }
}

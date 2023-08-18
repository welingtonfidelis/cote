const LOCAL_STORAGE_PERSONALIZED_RULES = "cote-personalized-rules";
const LOCAL_STORAGE_PREDEFINED_RULES = "cote-predefined-rules";

let dragElement = null;

function handleDragStart(e) {
  this.classList.add("over-from");

  dragElement = this;

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = "move";

  return false;
}

function handleDragEnter(e) {
  if (dragElement != this) this.classList.add("over-to");
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  if (dragElement != this) {
    const [inptFromABef, inptToABef] = this.getElementsByTagName("input");
    const [inptFromBBef, inptToBBef] = dragElement.getElementsByTagName("input");

    dragElement.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");

    dragElement.getElementsByTagName("input")[0].value = inptFromABef.value;
    dragElement.getElementsByTagName("input")[1].value = inptToABef.value;

    this.getElementsByTagName("input")[0].value = inptFromBBef.value;
    this.getElementsByTagName("input")[1].value = inptToBBef.value;
  }

  const items = document.querySelectorAll(".personalized-rule-item");
  items.forEach(function (item) {
    item.classList.remove("over-to");
    item.classList.remove("over-from");
  });

  return false;
}

const addDragAndDropEventListener = (e) => {
  e.addEventListener("dragstart", handleDragStart, false);
  e.addEventListener("dragenter", handleDragEnter, false);
  e.addEventListener("dragover", handleDragOver, false);
  e.addEventListener("drop", handleDrop, false);

  return e;
};

const randomString = (prefix) => {
  return Math.random()
    .toString(36)
    .replace("0.", prefix ?? "");
};

const handleCheckboxChange = (key) => {
  if (key === "upper-case") {
    document.getElementById("lower-case").checked = false;
  }

  if (key === "lower-case") {
    document.getElementById("upper-case").checked = false;
  }
};

const handlePersonalizedAdd = () => {
  const refClone = document.getElementById("personalized-rule-pattern");
  const clone = refClone.cloneNode(true);
  const newId = randomString("input");

  clone.id = newId;
  clone.style.display = "flex";

  refClone.before(clone);

  const newElement = document.getElementById(newId);
  addDragAndDropEventListener(newElement);

  return newId;
};

const handlePersonalizeRemove = (event) => {
  const parentId = event.target.parentElement.id;
  const element = document.getElementById(parentId);

  element.remove();
};

const handleConvertText = () => {
  const inputTextElement = document.getElementById("input-text");
  const outputTextElement = document.getElementById("output-text");
  const outputTextCountElement = document.getElementById("output-text-count");
  const toLowerCase = document.getElementById("lower-case").checked;
  const toUpperCase = document.getElementById("upper-case").checked;

  const textFromElement = document.querySelectorAll("[id=personalized-from]");
  const textToElement = document.querySelectorAll("[id=personalized-to]");

  const personalizedRules = [];
  let textToConvert = inputTextElement.value;

  textFromElement.forEach((item, index) => {
    const from = item.value;
    const to = textToElement[index].value ?? "";

    if (from) {
      personalizedRules.push({ from, to });

      textToConvert = textToConvert.replaceAll(from, to);
    }
  });

  if (toLowerCase) textToConvert = textToConvert.toLowerCase();
  if (toUpperCase) textToConvert = textToConvert.toUpperCase();

  localStorage.setItem(
    LOCAL_STORAGE_PREDEFINED_RULES,
    JSON.stringify([{ toLowerCase }, { toUpperCase }])
  );

  localStorage.setItem(
    LOCAL_STORAGE_PERSONALIZED_RULES,
    JSON.stringify(personalizedRules)
  );

  outputTextElement.textContent = textToConvert;
  outputTextCountElement.textContent = textToConvert.length;
};

const handleCopyOutputText = () => {
  const copyText = document.getElementById("output-text");
  const copyButton = document.getElementById("copy-output-button");

  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  copyButton.innerText = "Copied";

  setTimeout(() => {
    copyButton.innerText = "Copy Text";
  }, 3000);
};

document.addEventListener("DOMContentLoaded", () => {
  try {
    const initialPersonalizedRules = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PERSONALIZED_RULES) ?? "[]"
    );

    const initialPredefinedRules = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PREDEFINED_RULES) ?? "[]"
    );

    initialPredefinedRules.forEach((item) => {
      if (item["toLowerCase"])
        document.getElementById("lower-case").checked = true;
      if (item["toUpperCase"])
        document.getElementById("upper-case").checked = true;
    });

    initialPersonalizedRules.forEach((item) => {
      const { from, to } = item;

      const id = handlePersonalizedAdd();
      const inputContainer = document.getElementById(id);
      const [inputFrom, inputTo] = inputContainer.getElementsByTagName("input");

      inputFrom.value = from;
      inputTo.value = to;
    });
  } catch (error) {
    console.error("error: ", error);
  }
});

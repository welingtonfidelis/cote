const LOCAL_STORAGE_PERSONALIZED_RULES = "cote-personalized-rules";
const LOCAL_STORAGE_PREDEFINED_RULES = "cote-predefined-rules";

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
  clone.style.display = "block";

  refClone.before(clone);
  return newId;
};

const handlePersonalizeRemove = (event) => {
  const parentId = event.target.parentElement.id;
  const element = document.getElementById(parentId);

  element.remove();
};

const handleConvertText = () => {
  let outputText = document.getElementById("input-text").value;
  const toLowerCase = document.getElementById("lower-case").checked;
  const toUpperCase = document.getElementById("upper-case").checked;

  const textFrom = document.querySelectorAll("[id=personalized-from]");
  const textTo = document.querySelectorAll("[id=personalized-to]");

  const personalizedRules = [];

  textFrom.forEach((item, index) => {
    const from = item.value;
    const to = textTo[index].value ?? "";

    if (from) {
      personalizedRules.push({ from, to });

      outputText = outputText.replaceAll(from, to);
    }
  });

  if (toLowerCase) outputText = outputText.toLowerCase();
  if (toUpperCase) outputText = outputText.toUpperCase();

  localStorage.setItem(
    LOCAL_STORAGE_PREDEFINED_RULES,
    JSON.stringify([{ toLowerCase }, { toUpperCase }])
  );

  localStorage.setItem(
    LOCAL_STORAGE_PERSONALIZED_RULES,
    JSON.stringify(personalizedRules)
  );

  document.getElementById("output-text").textContent = outputText;
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
    console.debug("error: ", error);
  }
});

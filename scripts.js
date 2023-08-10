const handleCheckboxChange = (key) => {
  if (key === "upper-case") {
    document.getElementById("lower-case").checked = false;
  }

  if (key === "lower-case") {
    document.getElementById("upper-case").checked = false;
  }
};

const handlePersonalizedAdd = () => {
  const newId = new Date().getTime();

  const refClone = document.getElementById("personalized-rule-pattern");
  const clone = refClone.cloneNode(true);
  clone.id = `${clone.id}-${newId}`;
  clone.style.display = "block";

  refClone.before(clone);
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

  if (toLowerCase) outputText = outputText.toLowerCase();
  if (toUpperCase) outputText = outputText.toUpperCase();

  const textFrom = document.querySelectorAll("[id=personalized-from]");
  const textTo = document.querySelectorAll("[id=personalized-to]");

  textFrom.forEach((item, index) => {
    const from = item.value;
    const to = textTo[index].value;

    if (from) outputText = outputText.replaceAll(from, to);
  });

  document.getElementById("output-text").textContent = outputText;
};

const handleCopyOutputText = () => {
  const copyText = document.getElementById("output-text");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  const copyButton = document.getElementById("copy-output-button");
  copyButton.innerText = "Copied";
  setTimeout(() => {
    copyButton.innerText = "Copy Text";
  }, 3000);
};

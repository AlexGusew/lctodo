document.getElementById("saveBtn").addEventListener("click", () => {
  const token = document.getElementById("tokenInput").value;
  chrome.storage.sync.set({ userToken: token }, () => {
    alert("Token saved");
  });
});

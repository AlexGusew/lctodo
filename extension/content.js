
// Function to send a POST request with the current tab URL
function postCurrentTabUrl() {
  const url = window.location.href; // Get the current tab's URL
  chrome.storage.sync.get("userToken", (data) => {
    const userToken = data.userToken || "";
    const apiEndpoint = "http://localhost:3000/api/extension";

    console.log("api call");

    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-USER-API-TOKEN": userToken
      },
      body: JSON.stringify({ activeTabUrl: url })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        console.log("api call worked");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "postUrl") {
    postCurrentTabUrl();
  }
});

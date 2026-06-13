let currentScreen;

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const backBtn = document.getElementById("back-btn");
const resultsList = document.getElementById("results-list");
const episodeSection = document.getElementById("episode-section");
const selectedTitleEl = document.getElementById("selected-title");
const episodesList = document.getElementById("episodes-list");
const streamSection = document.getElementById("stream-section");
const selectedEpisode = document.getElementById("selected-episode");
const watcingArea = document.getElementById("watching-area");
const videoPlayer = document.getElementById("video-player");
const videoSource = document.getElementById("video-source");

backBtn.addEventListener("click", () => {
  if (currentScreen === "EPISODES") {
    // If on the episode list, go back to search results
    episodeSection.classList.add("hidden");
    backBtn.classList.add("hidden");
    resultsList.classList.remove("hidden");
    currentScreen = "SEARCH";
  } else if (currentScreen === "STREAM") {
    // If watching the stream, go back to episode list
    streamSection.classList.add("hidden");
    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoSource.removeAttribute("src");
    videoPlayer.load();

    episodeSection.classList.remove("hidden");
    currentScreen = "EPISODES";
  }
});

searchBtn.addEventListener("click", async () => {
  currentScreen = "SEARCH";
  const query = searchInput.value.trim();
  if (!query) return;

  resultsList.classList.remove("hidden");
  backBtn.classList.add("hidden");
  episodeSection.classList.add("hidden");
  streamSection.classList.add("hidden");

  resultsList.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch(
      `/api/search?searchTerm=${encodeURIComponent(query)}`,
    );
    const data = await res.json();

    resultsList.innerHTML = "";

    data.forEach((anime) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = anime.name;

      a.addEventListener("click", (e) => {
        e.preventDefault();
        selectAnime(anime._id, anime.name);
      });

      li.appendChild(a);
      resultsList.appendChild(li);
    });
  } catch (err) {
    resultsList.innerHTML = `<li style="color:red">Error loading results</li>`;
    console.error(err);
  }
});

async function selectAnime(id, title) {
  currentScreen = "EPISODES";
  selectedTitleEl.textContent = title;

  resultsList.classList.add("hidden");
  backBtn.classList.remove("hidden");
  episodeSection.classList.remove("hidden");

  episodesList.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch(`/api/episodes?showId=${id}`);
    const data = await res.json();

    const subList = data.episodes.sub;
    episodesList.innerHTML = "";

    subList.forEach((episodeNumber) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = episodeNumber;

      a.addEventListener("click", (e) => {
        e.preventDefault();
        playStream(id, episodeNumber, "sub");
      });

      li.appendChild(a);
      episodesList.appendChild(li);
    });
  } catch (err) {
    episodesList.innerHTML = `<li style="color:red">Error loading results</li>`;
    console.error(err);
  }
}

async function playStream(id, episodeNumber, episodeType) {
  currentScreen = "STREAM";
  episodeSection.classList.add("hidden");
  streamSection.classList.remove("hidden");
  selectedEpisode.textContent = episodeNumber;

  try {
    const res = await fetch(
      `/api/sources?showId=${id}&episodeNumber=${episodeNumber}&episodeType=${episodeType}`,
    );
    const { sourceUrl } = await res.json();
    const encodedUrl = encodeURIComponent(sourceUrl);
    const proxyUrl = `/api/stream?url=${encodedUrl}`;

    videoSource.src = proxyUrl;
    videoPlayer.load();
    videoPlayer.play();
  } catch (err) {
    watcingArea.innerHTML = `<li style="color:red">Error loading results</li>`;
    console.error(err);
  }
}

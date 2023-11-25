const displayCategories = (data) => {
  const allCategory = document.getElementById("allCategory");
  allCategory.innerHTML = "";
  data.forEach((category, index) => {
    const button = createCategoryButton(category, index);
    allCategory.appendChild(button);
  });
};

const loadCategories = async () => {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/videos/categories`
    );
    const data = await response.json();
    displayCategories(data?.data);
  } catch (error) {
    console.error("Error loading categories:", error);
  }
};

const handleCategoryClick = (categoryId) => {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.classList.remove("bg-[#ff1f3d]", "text-white");
  });
  const clickedButton = document.getElementById(categoryId);
  clickedButton.classList.add("bg-[#ff1f3d]", "text-white");
  loadVideos(categoryId);
};

const createCategoryButton = (category, index) => {
  const button = document.createElement("button");
  button.id = category.category_id;
  button.className = `btn ${index === 0 ? "bg-[#ff1f3d] text-white" : ""}`;
  button.innerHTML = category?.category;
  button.addEventListener("click", () =>
    handleCategoryClick(category.category_id)
  );
  return button;
};

const displayVideos = (data) => {
  const allVideos = document.getElementById("allVideos");
  const noVideos = document.getElementById("noVideos");

  if (data.length === 0) {
    displayNoVideos();
  } else if (data.length > 1) {
    noVideos.innerHTML = "";
    allVideos.innerHTML = "";

    data.forEach((video) => {
      const div = createVideoElement(video);
      allVideos.appendChild(div);
    });
  }
};

const displayNoVideos = () => {
  const allVideos = document.getElementById("allVideos");
  const noVideos = document.getElementById("noVideos");
  allVideos.innerHTML = "";
  noVideos.innerHTML = `
    <div class="flex flex-col mt-20 items-center justify-center">
      <img src="./images/icon.png" class="h-[140px] w-[140px]" alt="" />
      <h1 class="mt-8 text-3xl text-center font-bold md:w-[400px] w-[80%] mx-auto"> Oops!! Sorry, There is no content here</h1>
    </div>
  `;
};

function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const hoursString = `${hours} hour${hours === 1 ? "" : "s"}`;
    const minutesString = `${remainingMinutes} minute${
      remainingMinutes === 1 ? "" : "s"
    }`;
    return `${hoursString} ${minutesString} ago`;
  }
}

const createVideoElement = (video) => {
  const div = document.createElement("div");
  div.innerHTML = `
    <div class="h-fit rounded-lg">
      <figure class="w-full min-h-[100px] h-full sm:h-[200px] relative">
        <img src="${
          video.thumbnail
        }" class="h-full w-full rounded-md" alt="product"/>
        <div class="absolute bottom-2 right-2 text-white text-xs bg-transparent	p-0.5 rounded-md">
          <span> ${
            video?.others?.posted_date && formatTime(video?.others?.posted_date)
          }</span>
        </div>
      </figure>
      <div class="flex gap-3 mt-5">
        <div class="w-fit mt-0.5">
          <div class="avatar">
            <div class="w-10 rounded-full">
              <img src=${video?.authors[0].profile_picture} />
            </div>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-neutral-950 max-w-prose line-clamp-2 font-bold text-base ">${
            video.title
          }</h3>
          <div class="flex gap-2 mt-2 mb-2 items-center">
            <p class="text-sm text-[#171717]">${
              video?.authors[0].profile_name
            }</p>
            ${
              video?.authors[0].verified
                ? '<img src="./images/verified.svg" alt="" />'
                : ""
            }
          </div>
          <p class="text-sm mt-2 text-[#171717]">${
            video?.others?.views
          } views</p>
        </div>
      </div>
    </div>
  `;
  return div;
};

const loadVideos = async (id) => {
  const spinner = document.getElementById("spinner");
  try {
    spinner.style.display = "block";
    const response = await fetch(
      `https://openapi.programming-hero.com/api/videos/category/${id}`
    );
    const data = await response.json();
    displayVideos(data.data);
    videos = data.data;
  } catch (error) {
    console.error("Error loading videos:", error);
  } finally {
    spinner.style.display = "none";
  }
};

let isAscending = false;

const handleSorting = () => {
  isAscending = !isAscending;
  const sortContainer = document.getElementById("sort-btn-container");
  const sortOrder = isAscending ? 1 : -1;
  const sortMessage = isAscending ? "ascendingOrder" : "descendingOrder";
  sortContainer.setAttribute("data-tip", sortMessage);
  videos.sort((a, b) => {
    const viewsA = parseInt(a.others.views) || 0;
    const viewsB = parseInt(b.others.views) || 0;
    return sortOrder * (viewsA - viewsB);
  });
  displayVideos(videos);
};

loadVideos(1000);
loadCategories();

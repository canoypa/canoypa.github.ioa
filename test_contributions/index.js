import "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.8.8/pixi.min.js";

console.log(PIXI);

const app = new PIXI.Application({
  view: document.getElementById("stage"),
  antialias: true,
  backgroundColor: 0xeeeeee,
});

const c = new PIXI.Graphics()
  .beginFill(0x216e39)
  .drawRoundedRect(100, 100, 11, 11, 4);
console.log(c);

app.stage.addChild(c);

const userName = "canoypa";

const getContributionsData = async () => {
  const res = await fetch(
    `https://github-contributions-api.now.sh/v1/${userName}`
  );

  return res.json();
};

const isWithinRange = (date) => {
  const commitDate = new Date(date.setHours(0, 0, 0, 0));
  const commitTime = commitDate.getTime();

  const endDate = new Date(new Date().setHours(0, 0, 0, 0));
  const endTime = endDate.getTime();
  // endDate より後のものを排除
  if (endTime < commitTime) return false;

  const yearAgo = new Date(
    new Date(endDate).setFullYear(endDate.getFullYear() - 1)
  );
  const startDate = new Date(
    new Date(yearAgo).setDate(yearAgo.getDate() - yearAgo.getDay())
  );
  const startTime = startDate.getTime();
  // startDate より前のものを排除
  if (commitTime < startTime) return false;

  // あとは範囲内
  return true;

  // Debug
  /* if (
      committedDate.getFullYear() === 2020 &&
      committedDate.getMonth() === 6 &&
      committedDate.getDate() > 7 &&
      committedDate.getDate() < 11
    ) {
      console.log("");
      console.log(startDate);
      console.log(endDate);
      console.log(committedDate);
    } */
};

const getContributions = ({ contributions }) => {
  const filteredContributions = contributions.filter((cntr) =>
    isWithinRange(new Date(cntr.date))
  );

  filteredContributions.reverse();

  const result = [];
  let stack = [];
  filteredContributions.forEach((cntr) => {
    stack.push(cntr);

    if (new Date(cntr.date).getDay() === 6) {
      result.push(stack);
      stack = [];
    }
  });
  result.push(stack);

  return result;
};

const init = async () => {
  const res = await getContributionsData();
  console.log(res);

  const contributions = getContributions(res);

  console.log(contributions);

  const table = document.createElement("div");
  table.classList.add("table");
  contributions.forEach((weekCntrs) => {
    const week = document.createElement("div");
    week.classList.add("week");

    weekCntrs.forEach((cntr) => {
      const cntrelm = document.createElement("div");
      cntrelm.classList.add("day");
      cntrelm.style.backgroundColor = cntr.color;
      week.appendChild(cntrelm);
    });

    table.appendChild(week);
  });

  document.body.appendChild(table);
};
init();

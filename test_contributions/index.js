import "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.8.8/pixi.min.js";

const app = new PIXI.Application({
  view: document.getElementById("stage"),
  antialias: true,
  backgroundColor: 0xffffff,
});

const userName = "canoypa";

const isWithinPeriod = (committedDate, startDate, endDate) => {
  committedDate.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const commitTime = committedDate.getTime();

  const endTime = endDate.getTime();
  // endDate より後のものを排除
  if (endTime < commitTime) return false;

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
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  return contributions
    .filter(
      (cntr) =>
        cntr.count > 0 &&
        isWithinPeriod(new Date(cntr.date), startDate, endDate)
    )
    .map((cntr) => {
      const committedDate = new Date(cntr.date);

      return {
        count: cntr.count,
        color: cntr.color,
        week: ~~((committedDate - startDate) / (24 * 60 * 60 * 1000) / 7),
        day: committedDate.getDay(),
      };
    })
    .reverse();
};

const init = async () => {
  const req = await fetch(
    `https://github-contributions-api.now.sh/v1/${userName}`
  );
  const res = await req.json();
  console.log(res);

  const contributions = getContributions(res);

  console.log(contributions);

  contributions.forEach((cntr) => {
    const c = new PIXI.Graphics()
      .beginFill(cntr.color.replace(/#/, "0x"))
      .drawRoundedRect(cntr.week * 15, cntr.day * 15, 11, 11, 2);
    app.stage.addChild(c);
  });
};
init();

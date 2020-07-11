import "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.8.8/pixi.min.js";

const app = new PIXI.Application({
  view: document.getElementById("stage"),
  antialias: true,
  backgroundColor: 0xffffff,
});

const userName = "canoypa";

const isWithinPeriod = (committedDate, startDate, endDate) => {
  const commitTime = committedDate.setHours(0, 0, 0, 0);
  const startTime = startDate.setHours(0, 0, 0, 0);
  const endTime = endDate.setHours(0, 0, 0, 0);

  return endTime < commitTime || commitTime < startTime ? false : true;
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

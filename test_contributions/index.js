import "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.8.8/pixi.min.js";

const userName = "canoypa";

class ContributionsView {
  app = new PIXI.Application({
    view: document.getElementById("stage"),
    antialias: true,
    backgroundColor: 0xffffff,
  });

  stage = this.app.stage;

  constructor(contributions, startDate, endDate) {
    this.contributions = contributions;
    this.startDate = startDate;
    this.endDate = endDate;

    this.renderBackground();

    this.contributions.forEach((cntr) => {
      const c = new PIXI.Graphics()
        .beginFill(cntr.color.replace(/#/, "0x"))
        .drawRoundedRect(cntr.week * 15, cntr.day * 15, 11, 11, 2);
      this.stage.addChild(c);
    });
  }

  renderBackground() {
    const weekLen = ~~(
      (this.endDate - this.startDate) /
      (24 * 60 * 60 * 1000) /
      7
    );

    for (let week = 0; week < weekLen; week = (week + 1) | 0) {
      for (let day = 0; day < 7; day = (day + 1) | 0) {
        const c = new PIXI.Graphics()
          .beginFill(0xebedf0)
          .drawRoundedRect(week * 15, day * 15, 11, 11, 2);

        this.stage.addChild(c);
      }
    }
  }
}

const isWithinPeriod = (committedDate, startDate, endDate) => {
  const commitTime = committedDate.setHours(0, 0, 0, 0);
  const startTime = startDate.setHours(0, 0, 0, 0);
  const endTime = endDate.setHours(0, 0, 0, 0);

  return endTime < commitTime || commitTime < startTime ? false : true;
};

const getContributions = (contributions, startDate, endDate) => {
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
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const req = await fetch(
    `https://github-contributions-api.now.sh/v1/${userName}`
  );
  const res = await req.json();
  console.log(res);

  const contributions = getContributions(res.contributions, startDate, endDate);

  new ContributionsView(contributions, startDate, endDate);
};
init();

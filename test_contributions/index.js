import "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.8.8/pixi.min.js";

const userName = "canoypa";

function cubicBezier(...b) {
  this.b = [
    [0, 0],
    [b[0], b[1]],
    [b[2], b[3]],
    [1, 1],
  ];

  this.p = (t, b = this.b) => {
    if (b.length === 1) return b[0];
    const left = this.p(t, b.slice(0, b.length - 1));
    const right = this.p(t, b.slice(1, b.length));
    return [(1 - t) * left[0] + t * right[0], (1 - t) * left[1] + t * right[1]];
  };

  return (t) => this.p(t)[1];
}

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
    this.renderContribution();
  }

  renderBackground() {
    const weekLen = ~~(
      (this.endDate - this.startDate) /
      (24 * 60 * 60 * 1000) /
      7
    );

    for (let week = 0; week <= weekLen; week = (week + 1) | 0) {
      for (let day = 0; day < 7; day = (day + 1) | 0) {
        const c = new PIXI.Graphics()
          .beginFill(0xebedf0)
          .drawRoundedRect(week * 15, day * 15, 11, 11, 2);

        this.stage.addChild(c);
      }
    }
  }

  renderContribution() {
    const weekLen =
      ~~((this.endDate - this.startDate) / (24 * 60 * 60 * 1000) / 7) +
      6 * 2 +
      1;

    const renderMap = this.contributions
      .map((cntr) => {
        const c = new PIXI.Graphics()
          .beginFill(cntr.color.replace(/#/, "0x"))
          .drawRoundedRect(cntr.week * 15, cntr.day * 15, 11, 11, 2);

        return {
          view: c,
          timing: (cntr.week + cntr.day * 2 + 1) / weekLen,
        };
      })
      .sort((a, b) => a.timing - b.timing);

    let index = 0;
    const cb = new cubicBezier(0.4, 0.0, 0.2, 1);
    console.log(cb(0), cb(0.5), cb(1));
    const startTime = performance.now();
    const render = (nowTime) => {
      const elapsed = ~~(nowTime - startTime) / 1000;
      const progress = cb(elapsed);

      while (renderMap[index] && renderMap[index].timing < progress) {
        this.stage.addChild(renderMap[index].view);
        index = index + 1;
      }

      if (progress <= 1) requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }
}

const isWithinPeriod = (committedDate, startDate, endDate) => {
  const commitTime = committedDate.getTime();
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

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
      committedDate.setHours(0, 0, 0, 0);

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
  endDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate() + 6 - endDate.getDay());

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setFullYear(endDate.getFullYear() - 1);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const req = await fetch(
    `https://github-contributions-api.now.sh/v1/${userName}`,
    { cache: "force-cache" }
  );
  const res = await req.json();
  console.log(res);

  const contributions = getContributions(res.contributions, startDate, endDate);

  new ContributionsView(contributions, startDate, endDate);
};
init();

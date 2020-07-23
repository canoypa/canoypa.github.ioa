import PIXI from "pixi.js";

type IContributionsAPI = {
  years: IContributionsAPIYears;
  contributions: IContributionsAPIContributions;
};
type IContributionsAPIYears = Record<
  number,
  {
    year: string;
    total: number;
    range: Record<"start" | "end", string>;
  }
>;
type IContributionsAPIContributions = Array<{
  date: string;
  count: number;
  color: string;
  intensity: number;
}>;

type IContributions = Array<{
  count: number;
  color: string;
  week: number;
  day: number;
}>;

const userName = "canoypa";

function cubicBezier(...b: number[]) {
  const _b: [number, number][] = [
    [0, 0],
    [b[0], b[1]],
    [b[2], b[3]],
    [1, 1],
  ];

  const p = (t: number, b = _b): [number, number] => {
    if (b.length === 1) return b[0];
    const left = p(t, b.slice(0, b.length - 1));
    const right = p(t, b.slice(1, b.length));
    return [(1 - t) * left[0] + t * right[0], (1 - t) * left[1] + t * right[1]];
  };

  return (t: number) => p(t)[1];
}

class ContributionsView {
  app = new PIXI.Application({
    view: document.getElementById("stage")! as HTMLCanvasElement,
    antialias: true,
    backgroundColor: 0xffffff,
  });

  stage = this.app.stage;

  constructor(
    private contributions: IContributions,
    private startDate: Date,
    private endDate: Date
  ) {
    this.renderBackground();
    this.renderContribution();
  }

  renderBackground() {
    const weekLen = ~~(
      (this.endDate.getTime() - this.startDate.getTime()) /
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
      ~~(
        (this.endDate.getTime() - this.startDate.getTime()) /
        (24 * 60 * 60 * 1000) /
        7
      ) +
      6 * 2 +
      1;

    const renderMap = this.contributions
      .map((cntr) => {
        const c = new PIXI.Graphics()
          .beginFill(Number(cntr.color.replace(/#/, "0x")))
          .drawRoundedRect(cntr.week * 15, cntr.day * 15, 11, 11, 2);

        return {
          view: c,
          timing: (cntr.week + cntr.day * 2 + 1) / weekLen,
        };
      })
      .sort((a, b) => a.timing - b.timing);

    const cb = cubicBezier(0.4, 0.0, 0.2, 1);
    const startTime = performance.now();
    let index = 0;
    const render = (nowTime: number) => {
      const elapsed = ~~(nowTime - startTime) / 1000;
      const progress = cb(elapsed);

      while (renderMap[index] && renderMap[index].timing < progress) {
        this.stage.addChild(renderMap[index].view);
        index = index + 1;
      }

      if (elapsed <= 1) requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }
}

const isWithinPeriod = (
  committedDate: Date,
  startDate: Date,
  endDate: Date
) => {
  const commitTime = committedDate.getTime();
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  return endTime < commitTime || commitTime < startTime ? false : true;
};

const getContributions = (
  contributions: IContributionsAPIContributions,
  startDate: Date,
  endDate: Date
): IContributions => {
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
        week: ~~(
          (committedDate.getTime() - startDate.getTime()) /
          (24 * 60 * 60 * 1000) /
          7
        ),
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
  const res: IContributionsAPI = await req.json();
  console.log(res);

  const contributions = getContributions(res.contributions, startDate, endDate);

  new ContributionsView(contributions, startDate, endDate);
};
init();

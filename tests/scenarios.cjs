const tab = (p, v) => p.click(`.tab[data-view="${v}"]`);
module.exports = {
  async fresh(p, shot) { await shot('onboarding'); await p.fill('#ob-name', 'Jason'); await p.click('#ob-go'); await shot('heute-neu', true); },
  async tabs(p, shot) {
    if (await p.$('[data-no]')) { await shot('whatsnew'); await p.click('[data-no]'); }
    await shot('heute', true);
    for (const v of ['training', 'uebungen', 'verlauf', 'profil']) { await tab(p, v); await shot(v, true); }
  },
  async detail(p, shot) {
    if (await p.$('[data-no]')) await p.click('[data-no]');
    await tab(p, 'uebungen');
    await p.click('[data-ex="bankdruecken"]'); await p.waitForTimeout(900); await shot('detail-gym');
    await p.evaluate(() => document.querySelector('#sheet').scrollTo(0, 520)); await shot('detail-gym-2');
    await p.evaluate(() => document.querySelector('#sheet').scrollTo(0, 1250)); await shot('detail-gym-3');
    await p.click('[data-close]');
    await p.click('[data-ex="couch-stretch"]'); await p.waitForTimeout(900); await shot('detail-mob');
    await p.click('[data-close]');
  },
  async workout(p, shot) {
    if (await p.$('[data-no]')) await p.click('[data-no]');
    await p.click('[data-act="gym"]'); await shot('workout-start');
    await p.fill('input[data-f="w"][data-i="0"][data-s="0"]', '62,5');
    await p.fill('input[data-f="r"][data-i="0"][data-s="0"]', '9');
    await p.click('[data-check="0:0"]'); await shot('workout-rest');
    await p.click('[data-r="skip"]');
    await p.click('[data-check="0:1"]'); await p.click('[data-r="skip"]');
    await p.click('[data-menu="1"]'); await shot('workout-menu'); await p.click('[data-close]');
    await p.click('#w-min'); await shot('heute-aktiv');
    await p.click('[data-act="resume"]');
    await p.click('#w-finish'); await shot('workout-confirm'); await p.click('#f-yes'); await shot('workout-done');
    await p.click('#w-done'); await tab(p, 'verlauf'); await shot('verlauf-nach', true);
  },
  async player(p, shot) {
    if (await p.$('[data-no]')) await p.click('[data-no]');
    await p.click('[data-act="routine"]'); await p.waitForTimeout(6200); await shot('player');
    await p.click('#p-close');
    await tab(p, 'training'); await p.click('#view-training [data-day="0"]'); await shot('plan-tag');
    await p.click('[data-close]'); await p.click('[data-act="switch"]'); await shot('plan-wahl');
  }
};
module.exports.kraft = async (p, shot) => {
  if (await p.$('[data-no]')) await p.click('[data-no]');
  await p.click('.tab[data-view="uebungen"]'); await p.click('[data-tab="kraft"]'); await shot('kraft-1');
  await p.click('[data-group="quadrizeps"]'); await shot('kraft-2');
  await p.fill('#ex-q', 'kabel'); await shot('kraft-3');
  await p.fill('#ex-q', ''); await p.click('[data-ex="kniebeuge"]'); await p.waitForTimeout(2600); await shot('kraft-4');
};

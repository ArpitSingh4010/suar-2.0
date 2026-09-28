import { GoaHero } from "../sections/GoaHero";
import { DressCodeIntro } from "../sections/DressCodeIntro";
import { DayOneYellow } from "../sections/DayOneYellow";
import { DayTwoMorning } from "../sections/DayTwoMorning";
import { DayTwoEvening } from "../sections/DayTwoEvening";
import { DressCodeEnd } from "../sections/DressCodeEnd";

export default function DressCodePage({ locked, onNavigate }) {
  return (
    <div className="page page-dress" data-testid="page-dress-code">
      <GoaHero />
      <DressCodeIntro />
      <DayOneYellow />
      <DayTwoMorning />
      <DayTwoEvening />
      <DressCodeEnd locked={locked} onNavigate={onNavigate} />
    </div>
  );
}

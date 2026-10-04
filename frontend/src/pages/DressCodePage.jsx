import { Loading } from "../components/Loading";
import { DressCodeIntro } from "../sections/DressCodeIntro";
import { DayOneYellow } from "../sections/DayOneYellow";
import { DayTwoMorning } from "../sections/DayTwoMorning";
import { DayTwoEvening } from "../sections/DayTwoEvening";
import { DressCodeEnd } from "../sections/DressCodeEnd";

export default function DressCodePage({ data, locked, onNavigate }) {
  if (!data) return <Loading />;
  return (
    <div className="page page-dress" data-testid="page-dress-code">
      <DressCodeIntro data={data.intro} />
      <DayOneYellow data={data.day_one} />
      <DayTwoMorning data={data.morning} />
      <DayTwoEvening data={data.evening} />
      <DressCodeEnd locked={locked} onNavigate={onNavigate} />
    </div>
  );
}

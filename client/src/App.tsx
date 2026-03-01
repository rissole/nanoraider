import { useGameStore } from "./store/gameStore";
import { MainMenu } from "./components/screens/MainMenu";
import { HeroCreation } from "./components/screens/HeroCreation";
import { PlanningScreen } from "./components/screens/PlanningScreen";
import { DayResults } from "./components/screens/DayResults";
import { DeathScreen } from "./components/screens/DeathScreen";
import { CollectionScreen } from "./components/screens/CollectionScreen";
import { UpgradesScreen } from "./components/screens/UpgradesScreen";

export default function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {screen === "main_menu" && <MainMenu />}
      {screen === "hero_creation" && <HeroCreation />}
      {screen === "planning" && <PlanningScreen />}
      {screen === "executing" && <PlanningScreen />}
      {screen === "day_results" && <DayResults />}
      {screen === "death" && <DeathScreen />}
      {screen === "collection" && <CollectionScreen />}
      {screen === "upgrades" && <UpgradesScreen />}
    </div>
  );
}

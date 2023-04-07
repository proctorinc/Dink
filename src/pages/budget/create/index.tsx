import {
  faCheck,
  faDollarSign,
  faPencil,
  faSquare,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthPage from "~/components/routes/AuthPage";
import Button, { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import Header from "~/components/ui/Header";
import Fund from "~/features/funds";
import useIcons from "~/hooks/useIcons";
import { api } from "~/utils/api";

export default function CreateBudgetPage() {
  const router = useRouter();
  const ctx = api.useContext();
  const { icons } = useIcons();

  const [name, setName] = useState("");
  const [goal, setGoal] = useState(0);
  const [isSavings, setIsSavings] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]?.name ?? "");
  const [fundId, setFundId] = useState<string | null>(null);

  const createBudget = api.budgets.create.useMutation({
    onSuccess: () => void ctx.invalidate(),
  });
  const fundsData = api.funds.getAllData.useQuery();
  const isValidData = !!name && !!selectedIcon && goal != 0;

  const handleConfirm = () => {
    if (isValidData) {
      createBudget.mutate({
        name,
        goal,
        isSavings,
        icon: selectedIcon,
        fundId,
      });
      void router.push("/budget");
    }
  };

  return (
    <AuthPage>
      <Header back title={`Create Budget`} />
      <Card>
        <Card.Body horizontal>
          <Card.Group>
            <label htmlFor="amount-input" className="font-bold">
              Name:
            </label>
            <Card.Group horizontal>
              <span className="text-2xl font-bold text-primary-light">
                <FontAwesomeIcon icon={faPencil} />
              </span>
              <input
                id="name-input"
                placeholder="Enter name..."
                className="bg-primary-med text-xl font-bold text-primary-light placeholder-primary-light"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Card.Group>
            <label htmlFor="amount-input" className="font-bold">
              Goal:
            </label>
            <Card.Group horizontal>
              <span className="text-2xl font-bold text-primary-light">
                <FontAwesomeIcon icon={faDollarSign} />
              </span>
              <input
                id="amount-input"
                type="number"
                className="bg-primary-med text-xl font-bold text-primary-light"
                value={goal}
                onChange={(event) => setGoal(Number(event.target.value))}
              />
            </Card.Group>
            <label htmlFor="amount-input" className="font-bold">
              Savings Transfer:
            </label>
            <Card.Group horizontal>
              <Button
                title="No"
                icon={isSavings ? faSquare : faSquareCheck}
                style={isSavings ? "primary" : "secondary"}
                onClick={() => setIsSavings(false)}
              />
              <Button
                title="Yes"
                icon={isSavings ? faSquareCheck : faSquare}
                style={isSavings ? "secondary" : "primary"}
                onClick={() => setIsSavings(true)}
              />
            </Card.Group>
            <Card.Collapse
              open={isSavings}
              className="max-h-64 overflow-y-scroll rounded-xl"
            >
              <Card.Group size="sm">
                {fundsData?.data?.funds.map((fund) => (
                  <Fund
                    key={fund.id}
                    data={fund}
                    onClick={() => setFundId(fund.id)}
                  />
                ))}
              </Card.Group>
            </Card.Collapse>
            <label htmlFor="amount-input" className="font-bold">
              Icon:
            </label>
            <Card.Group horizontal className="h-40 flex-wrap overflow-y-scroll">
              {icons.map((icon) => (
                <IconButton
                  key={icon.name}
                  icon={icon.icon}
                  style={selectedIcon === icon.name ? "secondary" : "primary"}
                  onClick={() => setSelectedIcon(icon.name)}
                />
              ))}
            </Card.Group>
          </Card.Group>
        </Card.Body>
      </Card>
      <div className="flex w-full justify-center gap-2">
        <Button
          title="Create"
          icon={faCheck}
          disabled={!isValidData}
          style="secondary"
          onClick={handleConfirm}
        />
      </div>
    </AuthPage>
  );
}

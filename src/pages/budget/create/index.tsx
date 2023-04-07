import {
  faCheck,
  faCoins,
  faDollarSign,
  faPencil,
  faPiggyBank,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Prisma, type Fund as FundType } from "@prisma/client";
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
  const [selectedIcon, setSelectedIcon] = useState(icons[0]?.name ?? "");
  const [fund, setFund] = useState<
    (FundType & { amount: Prisma.Decimal }) | null
  >(null);
  const [isSavings, setIsSavings] = useState<boolean | null>(null);

  const createSpending = api.budgets.createSpending.useMutation({
    onSuccess: () => void ctx.invalidate(),
  });
  const createSavings = api.budgets.createSavings.useMutation({
    onSuccess: () => void ctx.invalidate(),
  });
  const fundsData = api.funds.getAllData.useQuery();
  const isValidData =
    (!isSavings && !!name && !!selectedIcon && goal != 0) ||
    (!!isSavings && !!fund && goal != 0 && goal != 0);

  const handleConfirm = () => {
    if (isValidData && !isSavings) {
      createSpending.mutate({
        name,
        goal,
        icon: selectedIcon,
      });
      void router.push("/budget");
    } else if (isValidData && !!fund && !!isSavings) {
      createSavings.mutate({
        goal,
        fundId: fund.id,
      });
      void router.push("/budget");
    }
  };

  return (
    <AuthPage>
      <Header back title={`Create Budget`} />
      <Card>
        <Card.Collapse open={isSavings === null}>
          <Card onClick={() => setIsSavings(false)}>
            <Card.Header size="xl">
              <Card.Group horizontal>
                <IconButton icon={faCoins} style="secondary" />
                <h3>Spending</h3>
              </Card.Group>
            </Card.Header>
          </Card>
          <Card onClick={() => setIsSavings(true)}>
            <Card.Header size="xl">
              <Card.Group horizontal>
                <IconButton icon={faPiggyBank} style="secondary" />
                <h3>Savings</h3>
              </Card.Group>
            </Card.Header>
          </Card>
        </Card.Collapse>
        <Card.Collapse open={!!isSavings}>
          <Card>
            <Card.Body horizontal>
              <Card.Group>
                <label htmlFor="amount-input" className="font-bold">
                  Monthly Amount:
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
                <label className="font-bold">Choose Fund:</label>
                <Card.Collapse open={!!fund}>
                  {fund && <Fund data={fund} />}
                </Card.Collapse>
                <Card.Collapse
                  open={fund === null}
                  className="max-h-64 overflow-y-scroll rounded-xl"
                >
                  <Card.Group size="sm">
                    {fundsData?.data?.funds.map((fund) => (
                      <Fund
                        key={fund.id}
                        data={fund}
                        onClick={() => setFund(fund)}
                      />
                    ))}
                  </Card.Group>
                </Card.Collapse>
              </Card.Group>
            </Card.Body>
          </Card>
        </Card.Collapse>
        <Card.Collapse open={isSavings === false}>
          <Card>
            <Card.Body horizontal>
              <Card.Group>
                <label htmlFor="name-input" className="font-bold">
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
                <label className="font-bold">Icon:</label>
                <Card.Group
                  horizontal
                  className="h-40 flex-wrap overflow-y-scroll"
                >
                  {icons.map((icon) => (
                    <IconButton
                      key={icon.name}
                      icon={icon.icon}
                      style={
                        selectedIcon === icon.name ? "secondary" : "primary"
                      }
                      onClick={() => setSelectedIcon(icon.name)}
                    />
                  ))}
                </Card.Group>
              </Card.Group>
            </Card.Body>
          </Card>
        </Card.Collapse>
      </Card>
      <div className="flex w-full justify-center gap-2">
        <Button
          title="Create"
          icon={faCheck}
          disabled={!isValidData}
          style="secondary"
          onClick={handleConfirm}
        />
        <Button
          title="Reselect"
          icon={faRedo}
          disabled={isSavings === null}
          style={isValidData ? "primary" : "secondary"}
          onClick={() => setIsSavings(null)}
        />
      </div>
    </AuthPage>
  );
}

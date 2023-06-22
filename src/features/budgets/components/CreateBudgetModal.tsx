import {
  faAngleRight,
  faCheck,
  faCoins,
  faDollarSign,
  faPencil,
  faPiggyBank,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Prisma, type Fund as FundType } from "@prisma/client";
import { type FC, useState } from "react";
import Button, { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import Modal from "~/components/ui/Modal";
import Spinner from "~/components/ui/Spinner";
import Fund from "~/features/funds";
import useIcons from "~/hooks/useIcons";
import { api } from "~/utils/api";

type CreateBudgetModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateBudgetModal: FC<CreateBudgetModalProps> = ({
  open,
  onClose,
}) => {
  const ctx = api.useContext();
  const { icons } = useIcons();

  // const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]?.name ?? "");
  const [fund, setFund] = useState<
    (FundType & { amount: Prisma.Decimal }) | null
  >(null);
  const [isSavings, setIsSavings] = useState<boolean | null>(null);

  const createSpending = api.budgets.createSpending.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
      onClose();
    },
  });
  const createSavings = api.budgets.createSavings.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
      onClose();
    },
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
    } else if (isValidData && !!fund && !!isSavings) {
      createSavings.mutate({
        goal,
        fundId: fund.id,
      });
    }
  };

  const closeModal = () => {
    onClose();
    setName("");
    setGoal(0);
    setSelectedIcon(icons[0]?.name ?? "");
    setIsSavings(null);
    setFund(null);
  };

  return (
    <Modal title="Create Budget" open={open} onClose={closeModal}>
      {createSpending.isLoading || (createSavings.isLoading && <Spinner />)}
      {!createSpending.isLoading && !createSavings.isLoading && (
        <>
          <Card invisible noShadow>
            <Card.Collapse open={isSavings === null}>
              <Card invisible noShadow onClick={() => setIsSavings(false)}>
                <Card.Header size="xl">
                  <Card.Group horizontal>
                    <IconButton icon={faCoins} style="secondary" />
                    <h3>Spending</h3>
                  </Card.Group>
                </Card.Header>
              </Card>
              <Card invisible noShadow onClick={() => setIsSavings(true)}>
                <Card.Header size="xl">
                  <Card.Group horizontal>
                    <IconButton icon={faPiggyBank} style="secondary" />
                    <h3>Savings</h3>
                  </Card.Group>
                </Card.Header>
              </Card>
            </Card.Collapse>
            <Card.Collapse open={!!isSavings}>
              <Card invisible noShadow>
                <Card.Body horizontal>
                  <Card.Group className="w-full">
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
                        onChange={(event) =>
                          setGoal(Number(event.target.value))
                        }
                      />
                    </Card.Group>
                    <label className="font-bold">Choose Fund:</label>
                    <Card.Collapse open={!!fund}>
                      <Card invisible noShadow onClick={() => setFund(null)}>
                        <div className="flex gap-3">
                          {fund && (
                            <Fund
                              data={fund}
                              noShadow
                              onClick={() => setFund(null)}
                            />
                          )}
                          <IconButton icon={faAngleRight} />
                        </div>
                      </Card>
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
                            invisible
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
              <Card invisible noShadow>
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
                        onChange={(event) =>
                          setGoal(Number(event.target.value))
                        }
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
                          noShadow
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
              // disabled={!isValidData}
              style="secondary"
              onClick={handleConfirm}
            />
            <Button
              title="Reselect"
              icon={faRedo}
              // disabled={isSavings === null}
              style={isValidData ? "primary" : "secondary"}
              onClick={() => setIsSavings(null)}
            />
          </div>
        </>
      )}
    </Modal>
  );
};

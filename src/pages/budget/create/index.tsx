import {
  faCheck,
  faDollarSign,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useState } from "react";
import Button, { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import Header from "~/components/ui/Header";
import useIcons from "~/hooks/useIcons";
import { api } from "~/utils/api";

export default function CreateBudgetPage() {
  const router = useRouter();
  const { icons } = useIcons();

  const createBudget = api.budgets.create.useMutation();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]?.name ?? "");

  const isValidData = !!name && !!selectedIcon && goal != 0;

  const handleConfirm = () => {
    if (isValidData) {
      createBudget.mutate({ name, goal, icon: selectedIcon });
      void router.push("/budget");
    }
  };

  return (
    <>
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
              Icon:
            </label>
            <Card.Group horizontal>
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
          active
          onClick={handleConfirm}
        />
      </div>
    </>
  );
}

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { type PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";
import Button from "~/components/ui/Button";
import { api } from "~/utils/api";

export const PlaidLink = () => {
  const ctx = api.useContext();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const getLinkToken = api.plaid.getLinkToken.useMutation({
    onSuccess: (token) => setLinkToken(token),
  });
  const createPlaidItem = api.plaid.createItem.useMutation({
    onSuccess: () => void ctx.invalidate(),
  });

  const handleLinkSuccess: PlaidLinkOnSuccess = (public_token, metadata) => {
    if (metadata.institution) {
      createPlaidItem.mutate({
        publicToken: public_token,
        institutionId: metadata.institution.institution_id,
      });
    } else {
      console.error("Failed to link: Institution does not exist");
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken ?? null,
    onSuccess: handleLinkSuccess,
  });

  useEffect(() => {
    if (!!linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  return (
    <Button
      title="Account"
      icon={faPlus}
      onClick={() => getLinkToken.mutate()}
    />
  );
};

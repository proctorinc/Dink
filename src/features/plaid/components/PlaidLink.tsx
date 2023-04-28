import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { type FC, useEffect, useState } from "react";
import { type PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";
import Button from "~/components/ui/Button";
import useNotifications from "~/hooks/useNotifications";
import { api } from "~/utils/api";

type PlaidLinkProps = {
  style?: "primary" | "secondary";
};

export const PlaidLink: FC<PlaidLinkProps> = ({ style }) => {
  const ctx = api.useContext();
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const { setLoadingNotification, setErrorNotification } = useNotifications();

  const failedToLinkError = () => {
    setErrorNotification("Failed to link bank");
  };

  const getLinkToken = api.plaid.getLinkToken.useMutation({
    onSuccess: (token) => setLinkToken(token),
    onError: () => failedToLinkError(),
  });

  const handleSuccessfulLink: PlaidLinkOnSuccess = (public_token, metadata) => {
    setLoadingNotification("Linking bank...");
    if (metadata.institution) {
      createPlaidItem.mutate({
        publicToken: public_token,
        institutionId: metadata.institution.institution_id,
      });
    } else {
      failedToLinkError();
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken ?? null,
    onSuccess: (public_token, metadata) => {
      setLinkToken(null);
      handleSuccessfulLink(public_token, metadata);
    },
    onExit: () => setLinkToken(null),
  });

  const createPlaidItem = api.plaid.createInstitution.useMutation({
    onSuccess: () => void ctx.invalidate(),
    onError: () => failedToLinkError(),
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
      style={style}
      noShadow
      onClick={() => getLinkToken.mutate()}
    />
  );
};

// This is a skeleton starter React component generated by Plasmic.
// This file is owned by you, feel free to edit as you see fit.
import { HTMLElementRefOf } from "@plasmicapp/react-web";
import * as React from "react";
import {
  DefaultRedirectUrIsControlProps,
  PlasmicRedirectUrIsControl,
} from "../../plasmic/plasmic_kit_end_user_management/PlasmicRedirectUrIsControl";
import { AuthRedirectsTooltip } from "../widgets/DetailedTooltips";
import { LabelWithDetailedTooltip } from "../widgets/LabelWithDetailedTooltip";
import RedirectUriRow from "./RedirectUriRow";

// Your component props start with props for variants and slots you defined
// in Plasmic, but you can add more here, like event handlers that you can
// attach to named nodes in your component.
//
// If you don't want to expose certain variants or slots as a prop, you can use
// Omit to hide them:
//
// interface RedirectUrIsControlProps extends Omit<DefaultRedirectUrIsControlProps, "hideProps1"|"hideProp2"> {
//   // etc.
// }
//
// You can also stop extending from DefaultRedirectUrIsControlProps altogether and have
// total control over the props for your component.
export interface RedirectUrIsControlProps
  extends DefaultRedirectUrIsControlProps {
  redirectUris: string[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onChange: (idx: number, uri: string) => void;
  onSave: () => Promise<void>;
}

function RedirectUrIsControl_(
  props: RedirectUrIsControlProps,
  ref: HTMLElementRefOf<"div">
) {
  const { redirectUris, onAdd, onRemove, onChange, onSave, ...rest } = props;
  return (
    <PlasmicRedirectUrIsControl
      root={{ ref }}
      addBtn={{
        onClick: onAdd,
      }}
      redirectsLabel={{
        wrap: (node) => (
          <LabelWithDetailedTooltip tooltip={AuthRedirectsTooltip}>
            {node}
          </LabelWithDetailedTooltip>
        ),
      }}
      uris={redirectUris.map((uri, idx) => (
        <RedirectUriRow
          key={idx}
          uri={uri}
          onChange={(_uri) => onChange(idx, _uri)}
          onRemove={() => onRemove(idx)}
        />
      ))}
      saveBtn={{
        onClick: onSave,
      }}
      {...rest}
    />
  );
}

const RedirectUrIsControl = React.forwardRef(RedirectUrIsControl_);
export default RedirectUrIsControl;

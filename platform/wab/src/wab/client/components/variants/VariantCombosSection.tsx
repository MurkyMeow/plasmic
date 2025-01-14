import L from "lodash";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { Component } from "../../../classes";
import { ensure, partitions } from "../../../common";
import { findNonEmptyCombos } from "../../../shared/cached-selectors";
import { VariantCombo, variantComboKey } from "../../../shared/Variants";
import { PlasmicVariantCombosSection } from "../../plasmic/plasmic_kit_variants/PlasmicVariantCombosSection";
import { ViewCtx } from "../../studio-ctx/view-ctx";
import { VariantCombosTooltip } from "../widgets/DetailedTooltips";
import VariantComboRow from "./VariantComboRow";
import { makeVariantsController } from "./VariantsController";

const VariantCombosSection = observer(function VariantCombosSection(props: {
  viewCtx: ViewCtx;
  component: Component;
  onClickCombo?: (combo: VariantCombo) => void;
  onActivateCombo?: (combo: VariantCombo) => void;
}) {
  const { viewCtx, component, onClickCombo, onActivateCombo } = props;
  const [expanded, setExpanded] = React.useState(false);
  const variantsController = ensure(
    makeVariantsController(viewCtx.studioCtx),
    "variants controller must exist"
  );
  const combos = findNonEmptyCombos(component);
  const selectedVariants = variantsController.getTargetedVariants();
  const [relevantCombos, otherCombos] = partitions(combos, [
    (combo) => selectedVariants.every((v) => combo.includes(v)),
  ]);

  return (
    <PlasmicVariantCombosSection
      isExpanded={expanded}
      combinationsHeader={{
        onToggle: () => setExpanded(!expanded),
      }}
      listSectionSeparator={
        !(relevantCombos.length > 0 && otherCombos.length > 0)
          ? {
              render: () => null,
            }
          : undefined
      }
      // sort relevantCombos from shortest to longest
      relevantCombos={L.sortBy(relevantCombos, (combo) => combo.length).map(
        (combo) => (
          <VariantComboRow
            key={variantComboKey(combo)}
            combo={combo}
            onClick={onClickCombo ? () => onClickCombo(combo) : undefined}
            onActivate={
              onActivateCombo ? () => onActivateCombo(combo) : undefined
            }
            viewCtx={viewCtx}
          />
        )
      )}
      // sort other combos by most overlap with selected to least overlap
      otherCombos={L.sortBy(
        otherCombos,
        (combo) => -1 * combo.filter((v) => selectedVariants.includes(v)).length
      ).map((combo) => (
        <VariantComboRow
          key={variantComboKey(combo)}
          combo={combo}
          onClick={onClickCombo ? () => onClickCombo(combo) : undefined}
          onActivate={
            onActivateCombo ? () => onActivateCombo(combo) : undefined
          }
          viewCtx={viewCtx}
        />
      ))}
      combinationsInfo={{
        tooltip: <VariantCombosTooltip />,
      }}
    />
  );
});

export default VariantCombosSection;

import { Component, TplNode } from "../../../classes";
import type { ViewCtx } from "../../../client/studio-ctx/view-ctx";
import { ensure } from "../../../common";
import { $ } from "../../../deps";
import { isValNode, ValNode } from "../../../val-nodes";
import { InvalidDomNestingLintIssue } from "../lint-types";
import {
  AncestorInfo,
  getInvalidAncestor,
  updatedAncestorInfo,
} from "./reactValidateDomNesting";

const TYPE = "invalid-dom-nesting";

interface DomInfo {
  element: Element;
  valNode?: ValNode;
}

type AncestorDomInfo = AncestorInfo<DomInfo>;

const emptyAncestorInfo: AncestorDomInfo = {};

export function getInvalidDomNesting(viewCtx: ViewCtx) {
  const component = viewCtx.component;
  const valNodesInPath: ValNode[] = [];
  const issues: InvalidDomNestingLintIssue[] = [];
  const rec = (element: Element, ancestorInfo: AncestorDomInfo) => {
    // We stop the recursion if we encounter a rich text element
    // As we are in the dom the structure in the canvas to rich text
    // could be `p div` which would be an invalid nesting, but the
    // generated code won't have this nesting, we assume that rich text
    // won't generate invalid nesting
    if (Array.from(element.classList).includes("__wab_rich_text")) {
      return;
    }
    const selectable = viewCtx.dom2val($(element));
    if (selectable && isValNode(selectable)) {
      valNodesInPath.push(selectable);
    }

    const tag = element.tagName.toLowerCase();
    const invalidAncestor = getInvalidAncestor(tag, ancestorInfo);
    const domInfo: DomInfo = {
      element,
      valNode:
        valNodesInPath.length > 0
          ? valNodesInPath[valNodesInPath.length - 1]
          : undefined,
    };
    if (invalidAncestor) {
      const ancestorTpl = ensure(
        invalidAncestor.valNode,
        "Ancestor valNode should exist"
      ).tpl;
      const descendantTpl = ensure(
        domInfo.valNode,
        "Descendant valNode should exist"
      ).tpl;
      issues.push({
        key: makeIssueKey(component, ancestorTpl, descendantTpl),
        type: TYPE,
        component,
        ancestorTpl,
        descendantTpl,
      });
    }

    const newInfo = updatedAncestorInfo(ancestorInfo, domInfo, tag);

    Array.from(element.children).forEach((child) => {
      rec(child, newInfo);
    });

    if (selectable && isValNode(selectable)) {
      valNodesInPath.pop();
    }
  };

  const body = viewCtx.canvasCtx.$body().get(0);

  rec(body, emptyAncestorInfo);

  return issues;
}

function makeIssueKey(
  component: Component,
  ancestorTpl: TplNode,
  descendantTpl: TplNode
) {
  return `${TYPE}-${component.uuid}-${ancestorTpl.uuid}-${descendantTpl.uuid}`;
}

import React, { useContext } from 'react';
import classnames from 'classnames';
import { mutedText } from '@teambit/base-ui.text.muted-text';
import { ComponentID, ComponentModel } from '@teambit/component';
import { DeprecationIcon } from '@teambit/staged-components.deprecation-icon';
import { ellipsis } from '@teambit/styles.ellipsis';
import { ElevationHeight } from '@teambit/base-ui.css-components.elevation';
import { Card, CardProps } from '@teambit/base-ui.surfaces.card';

import { NodeModel } from '../query/graph-model';
import { ComponentGraphContext } from '../dependencies-graph/';

// keep order: styles, then variants
import styles from './component-node.module.scss';
import variants from './variants.module.scss';

export interface ComponentNode extends CardProps {
  node: NodeModel;
  type: string;
}

export function ComponentNode({ node, type = 'defaultNode', ...rest }: ComponentNode) {
  const graphContext = useContext(ComponentGraphContext);
  const { component } = node;
  const { id } = component;

  return (
    <Card className={classnames(styles.compNode, variants[type])} elevation={typeToElevation(type)} {...rest}>
      <div className={styles.firstRow}>
        <EnvIcon component={component} className={styles.envIcon} />
        <Breadcrumbs componentId={id} className={mutedText} />
      </div>
      <div className={styles.nameLine}>
        <span className={classnames(styles.name, ellipsis)}>{id.name}</span>
        {id.version && <span className={styles.version}>{id.version}</span>}

        <div className={styles.buffs}>
          <DeprecationIcon component={component} />
          {graphContext &&
            graphContext.componentWidgets
              .toArray()
              .map(([widgetId, Widget]) => <Widget key={widgetId} component={component} />)}
        </div>
      </div>
    </Card>
  );
}

type BreadcrumbsProps = { componentId: ComponentID } & React.HTMLAttributes<HTMLDivElement>;

function Breadcrumbs({ componentId, className, ...rest }: BreadcrumbsProps) {
  const { scope, namespace } = componentId;
  const showSep = !!scope && !!namespace;

  return (
    <div {...rest} className={classnames(styles.breadcrumbs, ellipsis, className)}>
      {scope}
      {showSep && '/'}
      {namespace}
    </div>
  );
}

// TODO - unify with sidebar widgets
type EnvIconProps = { component: ComponentModel } & React.HTMLAttributes<HTMLDivElement>;
function EnvIcon({ component, ...rest }: EnvIconProps) {
  if (!component || !component.environment?.icon) return null;

  return <img src={component.environment?.icon} alt={component.environment.id} {...rest} />;
}

function typeToElevation(componentType: string): ElevationHeight {
  switch (componentType) {
    case 'root':
      return 'medium';
    default:
      return 'none';
  }
}

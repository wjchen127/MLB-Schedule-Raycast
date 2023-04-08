import { Action, ActionPanel, Color, Icon, List, Detail } from "@raycast/api";
import { useState } from "react";



export default function Command() {

  const [detailIndex, setDetailIndex] = useState(-1)

  return (
    <>
      <List navigationTitle="MLB Schedule">
        <List.Section title="Today">
            <List.Item title="Red Sox vs. Yankees" actions={
              <ActionPanel >
                <Action.Push title="Detail" target={<DetailPanel />} />
              </ActionPanel>
            } icon={{ source: Icon.Circle, tintColor: Color.SecondaryText }}/>
            <List.Item title="Marlins vs. Mets" actions={
              <ActionPanel >
                <Action.Push title="Detail" target={<DetailPanel />} />
              </ActionPanel>
            } icon={{ source: Icon.Circle, tintColor: Color.Green }}/>
            <List.Item title="Rangers vs. Cubs TBD" actions={
              <ActionPanel >
                <Action.Push title="Detail" target={<DetailPanel />} />
              </ActionPanel>
            } icon={{ source: Icon.Circle, tintColor: Color.Red }}/>
        </List.Section>
        <List.Section title="Tomorrow">
          <List.Item title="Item 2" />
        </List.Section>
        <List.Section title="April, 10th, 2023">
          <List.Item title="Item 2" />
        </List.Section>
      </List>
    </>
  );
}


function DetailPanel() {
  return <Detail markdown="Pong" />;
}
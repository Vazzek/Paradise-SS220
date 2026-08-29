import { Button, LabeledList, ProgressBar, Section, Stack, Table } from 'tgui-core/components';
import { toFixed } from 'tgui-core/math';

import { useBackend } from '../backend';
import { Window } from '../layouts';

interface GeneratorCoreData {
active: number;

generators?: Array<{
generator_id: string;
area_name: string;
active: number;
temperature: number;
}>;

generator_on: number;

power_output: number;
max_power_output: number;
max_safe_output: number;

fuel: number;
max_fuel: number;

temperature: number;
max_temperature: number;

overheating: number;

ambient_temperature?: number;
ambient_pressure?: number;
}

export const GeneratorCoreMonitor = () => {
const { data } = useBackend<GeneratorCoreData>();

if (data.active === 0) {
return <GeneratorCoreListView />;
}

return <GeneratorCoreDataView />;
};

const GeneratorCoreListView = () => {
const { act, data } = useBackend<GeneratorCoreData>();
const { generators = [] } = data;

return (
<Window width={500} height={300}>
<Window.Content scrollable>
<Section
fill
title="Detected Generator Cores"
buttons={
<Button
icon="sync"
content="Refresh"
onClick={() => act('refresh')}
/>
}
>
<Table>
{generators.map((generator) => (
<Table.Row key={generator.generator_id}>
<Table.Cell>
{generator.area_name}
</Table.Cell>

            <Table.Cell collapsing color="label">
              Status:
            </Table.Cell>

            <Table.Cell collapsing>
              {generator.active ? 'ONLINE' : 'OFFLINE'}
            </Table.Cell>

            <Table.Cell collapsing color="label">
              Temperature:
            </Table.Cell>

            <Table.Cell collapsing>
              {toFixed(generator.temperature) + ' K'}
            </Table.Cell>

            <Table.Cell collapsing>
              <Button
                content="Details"
                onClick={() =>
                  act('view', {
                    view: generator.generator_id,
                  })
                }
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </Section>
  </Window.Content>
</Window>

);
};

const GeneratorCoreDataView = () => {
const { act, data } = useBackend<GeneratorCoreData>();

const {
generator_on,
power_output,
max_power_output,
max_safe_output,
fuel,
max_fuel,
temperature,
max_temperature,
overheating,
ambient_temperature,
ambient_pressure,
} = data;

return (
<Window width={600} height={400}>
<Window.Content>
<Stack fill vertical>

      <Stack.Item>
        <Section
          title="T.H.E.G.E.N.E.R.A.T.O.R.C.O.R.E"
          buttons={
            <Button
              icon="arrow-left"
              content="Back"
              onClick={() => act('back')}
            />
          }
        >
          <Stack>

            <Stack.Item grow>
              <Button
                fluid
                icon="power-off"
                content={generator_on ? 'SHUT DOWN' : 'START GENERATOR'}
                color={generator_on ? 'bad' : 'good'}
                onClick={() => act('toggle')}
              />
            </Stack.Item>

          </Stack>
        </Section>
      </Stack.Item>


      <Stack.Item grow>
        <Stack fill>

          <Stack.Item width="50%">
            <Section fill title="Generator Status">

              <LabeledList>

                <LabeledList.Item label="Fuel">
                  <ProgressBar
                    value={fuel}
                    minValue={0}
                    maxValue={max_fuel}
                    ranges={{
                      good: [max_fuel * 0.5, Infinity],
                      average: [max_fuel * 0.2, max_fuel * 0.5],
                      bad: [-Infinity, max_fuel * 0.2],
                    }}
                  >
                    {fuel + ' / ' + max_fuel + ' Plasma Sheets'}
                  </ProgressBar>
                </LabeledList.Item>
                <LabeledList.Item label="Core Temperature">
                  <ProgressBar
                    value={temperature}
                    minValue={0}
                    maxValue={max_temperature}
                    ranges={{
                      good: [-Infinity, max_temperature * 0.6],
                      average: [
                        max_temperature * 0.6,
                        max_temperature * 0.85,
                      ],
                      bad: [max_temperature * 0.85, Infinity],
                    }}
                  >
                    {toFixed(temperature) + ' / ' + max_temperature + ' K'}
                  </ProgressBar>
                </LabeledList.Item>

                <LabeledList.Item label="Overheating">
                  <ProgressBar
                    value={overheating}
                    minValue={0}
                    maxValue={60}
                    ranges={{
                      good: [0, 10],
                      average: [10, 30],
                      bad: [30, Infinity],
                    }}
                  >
                    {overheating}
                  </ProgressBar>
                </LabeledList.Item>

                <LabeledList.Item label="Ambient Temperature">
                  {ambient_temperature !== undefined
                    ? toFixed(ambient_temperature) + ' K'
                    : 'N/A'}
                </LabeledList.Item>

                <LabeledList.Item label="Ambient Pressure">
                  {ambient_pressure !== undefined
                    ? toFixed(ambient_pressure) + ' kPa'
                    : 'N/A'}
                </LabeledList.Item>

              </LabeledList>
            </Section>
          </Stack.Item>

          <Stack.Item width="50%">
            <Section fill title="Heat Output">
              <LabeledList>

                <LabeledList.Item label="Current Level">
                  <ProgressBar
                    value={power_output}
                    minValue={0}
                    maxValue={max_power_output}
                    ranges={{
                      good: [0, max_safe_output],
                      average: [
                        max_safe_output,
                        max_safe_output + 1,
                      ],
                      bad: [
                        max_safe_output + 1,
                        Infinity,
                      ],
                    }}
                  >
                    {power_output + ' / ' + max_power_output}
                  </ProgressBar>
                </LabeledList.Item>

                <LabeledList.Item label="Safe Level">
                  {max_safe_output}
                </LabeledList.Item>

                <LabeledList.Item label="Heat Level">
                  <Stack wrap>
                    {Array.from(
                      { length: max_power_output },
                      (_, index) => {
                        const level = index + 1;

                        return (
                          <Stack.Item key={level}>
                            <Button
                              content={level}
                              selected={power_output === level}
                              color={
                                level > max_safe_output
                                  ? 'bad'
                                  : 'good'
                              }
                              onClick={() =>
                                act('change_power', {
                                  power: level,
                                })
                              }
                            />
                          </Stack.Item>
                        );
                      },
                    )}
                  </Stack>
                </LabeledList.Item>

              </LabeledList>
            </Section>
          </Stack.Item>

        </Stack>
      </Stack.Item>

    </Stack>
  </Window.Content>
</Window>
  );
};

/**********************************************************************************
 *                                                                                *
 *    Copyright (C) 2021  SYMON Contributors                                      *
 *                                                                                *
 *   This program is free software: you can redistribute it and/or modify         *
 *   it under the terms of the GNU Affero General Public License as published     *
 *   by the Free Software Foundation, either version 3 of the License, or         *
 *   (at your option) any later version.                                          *
 *                                                                                *
 *   This program is distributed in the hope that it will be useful,              *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of               *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                *
 *   GNU Affero General Public License for more details.                          *
 *                                                                                *
 *   You should have received a copy of the GNU Affero General Public License     *
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.       *
 *                                                                                *
 **********************************************************************************/

import { Story, Meta } from "@storybook/react/types-6-0";

import { Button, ButtonProps } from "./Button";

export default {
  title: "Button",
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = args => <Button {...args} />;

export const Small = Template.bind({});
Small.args = {
  label: "Small",
  size: "small",
};

export const Medium = Template.bind({});
Medium.args = {
  label: "Medium",
};

export const Large = Template.bind({});
Large.args = {
  label: "Large",
  size: "large",
};

export const Light = Template.bind({});
Light.args = {
  label: "Light",
  variant: "light",
};

export const Dark = Template.bind({});
Dark.args = {
  label: "Dark",
  variant: "dark",
};

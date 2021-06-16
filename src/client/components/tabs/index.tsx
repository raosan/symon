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

import { useState } from "react";

type pane = {
  key: string;
  title: string;
  content: React.ReactNode;
};

export type tabsProps = {
  activeKey?: string;
  className?: string;
  onChange?: (activeKey: string) => unknown;
  panes?: pane[];
};

export default function Tabs({
  activeKey,
  className,
  onChange,
  panes = [],
}: tabsProps): JSX.Element {
  const [internalActiveKey, setInternalActiveKey] = useState(activeKey);
  const handleClick = (key: string) => {
    setInternalActiveKey(key);
    onChange && onChange(key);
  };

  return (
    <div className={className}>
      <nav className="flex flex-col sm:flex-row border-b border-gray-400">
        {panes.map(({ key, title }: pane) => {
          const isActive = internalActiveKey === key;
          const activeClassname = isActive ? "font-bold" : "text-gray-500";

          return (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className={`text-lg py-4 pr-6 hover:text-black focus:outline-none ${activeClassname}`}
            >
              {title}
            </button>
          );
        })}
      </nav>
      <div>
        {panes.find(({ key }: pane) => key === internalActiveKey)?.content}
      </div>
    </div>
  );
}

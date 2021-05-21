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

import { fromUnixTime, format } from "date-fns";
import { Button, Layout, Table, Tabs, Title } from "../components";
import Tag from "../components/tag";

export default function Index(): JSX.Element {
  const tabPanes = [
    { key: "requests", title: "Requests", content: <Requests /> },
    { key: "alerts", title: "Alerts", content: "Alerts" },
    { key: "incidents", title: "Incidents", content: "Incidents" },
    { key: "recoveries", title: "Recoveries", content: "Recoveries" },
  ];

  return (
    <Layout>
      <div className="flex gap-5">
        <Title level={4}>Probe 1</Title>
        <Tag>Online (24 hours)</Tag>
      </div>
      <Tabs activeKey="requests" panes={tabPanes} className="mt-12" />
    </Layout>
  );
}

function Requests() {
  const columns = [
    {
      title: "Time",
      key: "timestamp",
      render: (timestamp: any) =>
        format(fromUnixTime(timestamp), "MMM dd hh:mm:ss"),
    },
    {
      title: "Response time (ms)",
      key: "response_time",
    },
    {
      title: "Response size (kB)",
      key: "response_size",
    },
    {
      title: "Response status",
      key: "response_status",
    },
    {
      title: "URL",
      key: "request_url",
    },
  ];

  return (
    <>
      <Table columns={columns} />
      <div className="flex mt-20 justify-center">
        <Button label="Load more" variant="light" />
      </div>
    </>
  );
}

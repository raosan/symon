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
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "react-query";
import { Alert, Button, Layout, Table, Tabs, Title } from "../components";
import { fetcher } from "../data/requests";
import Tag from "../components/tag";

type paramTypes = {
  orgName: string;
  probeID: string;
};

type requestProps = {
  probeID: string;
};

export default function Index(): JSX.Element {
  const { probeID } = useParams<paramTypes>();
  const tabPanes = [
    {
      key: "requests",
      title: "Requests",
      content: <Requests probeID={probeID} />,
    },
    { key: "alerts", title: "Alerts", content: "Alerts" },
    { key: "incidents", title: "Incidents", content: "Incidents" },
    { key: "recoveries", title: "Recoveries", content: "Recoveries" },
  ];

  return (
    <Layout>
      <div className="flex gap-5">
        <Title level={4}>Probe {probeID}</Title>
        <Tag>Online (24 hours)</Tag>
      </div>
      <Tabs activeKey="requests" panes={tabPanes} className="mt-12" />
    </Layout>
  );
}

function Requests({ probeID }: requestProps) {
  const limit = 30;
  const fetchReportRequests = ({ pageParam = "" }) =>
    fetcher(
      `/report-requests?fields=id,timestamp,responseTime,responseSize,responseStatus,requestUrl` +
        `&filter=probeId equals ${probeID}&cursor=${pageParam}&limit=${limit}&sort=id desc`,
      {
        method: "GET",
      },
    );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("reportRequests", fetchReportRequests, {
    getNextPageParam: lastPage => lastPage?.data[limit - 1]?.id,
  });
  const columns = [
    {
      title: "Time",
      key: "timestamp",
      render: (timestamp: any) =>
        format(fromUnixTime(timestamp), "MMM dd hh:mm:ss"),
    },
    {
      title: "Response time (ms)",
      key: "responseTime",
    },
    {
      title: "Response size (kB)",
      key: "responseSize",
    },
    {
      title: "Response status",
      key: "responseStatus",
    },
    {
      title: "URL",
      key: "requestUrl",
    },
  ];
  const dataSource = data?.pages?.reduce((acc, pages) => {
    const newPage = pages?.data?.map(
      (reportRequest: Record<string, unknown>) => ({
        ...reportRequest,
        key: reportRequest.id,
      }),
    );

    return [...acc, ...newPage];
  }, []);

  return (
    <>
      {status === "error" ? (
        <Alert
          message="Error"
          description="Failed to get API Key data"
          type="error"
        />
      ) : (
        <Table
          isLoading={status === "loading"}
          dataSource={dataSource}
          columns={columns}
        />
      )}
      {hasNextPage && (
        <div className="flex mt-20 justify-center">
          <Button
            label={isFetchingNextPage ? "Loading..." : "Load more"}
            variant="light"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          />
        </div>
      )}
    </>
  );
}

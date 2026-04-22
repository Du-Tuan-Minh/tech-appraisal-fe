import Button from "../ui/Button";
import Card from "../ui/Card";
import Pagination from "../ui/Pagination";

import { IssueStatus, ISSUE_STATUS_LABELS } from "../../constants/enum/IssueStatus";
import { ISSUE_CATEGORY_LABELS } from "../../constants/enum/IssueCategory";
import { IssueSeverity, ISSUE_SEVERITY_LABELS } from "../../constants/enum/IssueSeverity";
import type { FeedbackIssueResponseDto } from "../../types/feedback";

const SEVERITY_COLORS: Record<IssueSeverity, string> = {
  [IssueSeverity.Minor]: "text-blue-400 bg-blue-900/20",
  [IssueSeverity.Moderate]: "text-yellow-400 bg-yellow-900/20",
  [IssueSeverity.Serious]: "text-orange-400 bg-orange-900/20",
  [IssueSeverity.Critical]: "text-red-400 bg-red-900/20",
};

const STATUS_COLORS: Record<IssueStatus, string> = {
  [IssueStatus.New]: "text-yellow-400 bg-yellow-900/20",
  [IssueStatus.InProcessing]: "text-blue-400 bg-blue-900/20",
  [IssueStatus.Adjusted]: "text-indigo-400 bg-indigo-900/20",
  [IssueStatus.Closed]: "text-green-400 bg-green-900/20",
  [IssueStatus.Rejected]: "text-red-400 bg-red-900/20",
};

interface FeedbackListProps {
  data: FeedbackIssueResponseDto[];
  isLoading?: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRowClick?: (id: string) => void;
  onCreateNew?: () => void;
}

const FeedbackList = ({
  data,
  isLoading,
  totalCount,
  totalPages,
  currentPage,
  onPageChange,
  onRowClick,
  onCreateNew
}: FeedbackListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Danh sách phản hồi</h2>
          <p className="text-sm text-gray-400 mt-1">
            Tổng cộng <span className="text-primary-400 font-semibold">{totalCount}</span> bản ghi
          </p>
        </div>
        {onCreateNew && (
          <Button variant="primary" onClick={onCreateNew} className="shadow-lg shadow-primary-500/20">
            + Ghi nhận Issue mới
          </Button>
        )}
      </div>

      <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-800/70 border-b border-dark-700">
                <th className="p-4 text-primary-300 font-semibold text-xs uppercase tracking-wider">mô tả lỗi</th>
                <th className="p-4 text-primary-300 font-semibold text-xs uppercase tracking-wider">Mức độ</th>
                <th className="p-4 text-primary-300 font-semibold text-xs uppercase tracking-wider">Trạng thái</th>
                <th className="p-4 text-center text-primary-300 font-semibold text-xs uppercase tracking-wider w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-primary-500/5 transition-colors cursor-pointer group"
                    onClick={() => onRowClick?.(item.id)}
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {item.description.length > 60 ? item.description.slice(0, 60) + "..." : item.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${SEVERITY_COLORS[item.severity]}`}>
                        {ISSUE_SEVERITY_LABELS[item.severity]}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_COLORS[item.status]}`}>
                        {ISSUE_STATUS_LABELS[item.status]}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick?.(item.id);
                        }}
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-500">
                    Chưa có dữ liệu phản hồi nào cho phiên bản này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
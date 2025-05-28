"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaEye, FaEdit, FaDownload, FaFilm, FaSearch } from "react-icons/fa";
import InputField from "./InputField";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";

type Member = {
  id: string;
  name: string;
  imageUrl?: string;
  speciality: string;
  status: "Active" | "Pending" | "Inactive";
  dateAdded: string;
  approvalStatus?: "approved" | "disapproved" | "pending";
};

type MemberTableProps = {
  members: Member[];
  onPreview: (id: string) => void;
  onEdit: (id: string) => void;
  onDownload: (id: string) => void;
  approvalState?: boolean;
  onApprove?: (id: string) => void;
  onDisapprove?: (id: string) => void;
};

const ITEMS_PER_PAGE = 4;

const MemberTable: React.FC<MemberTableProps> = ({
  members,
  onPreview,
  onEdit,
  onDownload,
  approvalState,
  onApprove,
  onDisapprove,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(members);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = members.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.speciality.toLowerCase().includes(term),
    );
    setFilteredMembers(result);
    setCurrentPage(1);
  }, [searchTerm, members]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mt-6 text-gray-900 dark:text-white">
      {/* Controls */}
      <div className="flex w-full items-center gap-2 mb-4">
        <div className="w-full">
          <InputField
            id="search"
            label=""
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients or ads..."
            icon={<FaSearch className="text-gray-400" />}
          />
        </div>
        <div className="bg-gray-200 dark:bg-gray-800 rounded-lg inline-flex text-sm h-10 mb-3">
          <button
            className={`px-3 py-0.5 rounded ${
              viewMode === "grid"
                ? "bg-red-600 text-white"
                : "text-gray-700 dark:text-gray-400"
            }`}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={`px-3 py-0.5 rounded ${
              viewMode === "list"
                ? "bg-red-600 text-white"
                : "text-gray-700 dark:text-gray-400"
            }`}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>
      </div>

      {/* Grid or List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-lg hover:border-red-500 transition-all"
            >
              <div className="p-2">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        layout="fill"
                        objectFit="cover"
                        className="opacity-50 object-top"
                      />
                    ) : (
                      <FaFilm className="text-4xl text-gray-400" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-medium px-1 py-0.5 rounded ${
                        member.status === "Active"
                          ? "bg-green-500/20 text-green-600 dark:text-green-400"
                          : member.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                            : "bg-gray-500/20 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {member.status}
                    </span>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {member.speciality}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Added on {new Date(member.dateAdded).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2 ">
                  <div className="flex justify-between gap-2">
                    <button
                      className="w-full justify-center flex items-center space-x-1 text-xs text-white bg-blue-600 p-2 rounded-sm"
                      onClick={() => onPreview(member.id)}
                    >
                      <FaEye />
                      <span>Preview</span>
                    </button>
                    <button
                      className="w-full justify-center flex items-center space-x-1 text-xs text-white bg-purple-600 p-2 rounded-sm"
                      onClick={() => onEdit(member.id)}
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      className="w-full justify-center flex items-center space-x-1 text-xs text-white bg-green-600 p-2 rounded-sm"
                      onClick={() => onDownload(member.id)}
                    >
                      <FaDownload />
                      <span>Download</span>
                    </button>
                  </div>
                  {approvalState && (
                    <div className="flex-1 mt-1 flex items-center justify-center space-x-2 w-full">
                      {member.approvalStatus === "approved" ? (
                        <>
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                            ✅ Approved
                          </span>
                          <button
                            className="flex-1 flex items-center justify-center space-x-1 text-xs text-white bg-red-600 p-2 rounded-sm"
                            onClick={() => onDisapprove?.(member.id)}
                          >
                            <ImCross className="fill-white mr-1" />
                            <span>Disapprove</span>
                          </button>
                        </>
                      ) : member.approvalStatus === "disapproved" ? (
                        <>
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                            ❌ Disapproved
                          </span>
                          <button
                            className="flex-1 flex items-center justify-center space-x-1 text-xs text-white bg-emerald-600 p-2 rounded-sm"
                            onClick={() => onApprove?.(member.id)}
                          >
                            <FaCheck className="fill-white mr-1" />
                            <span>Approve</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="flex-1 flex items-center justify-center space-x-1 text-xs text-white bg-emerald-600 p-2 rounded-sm"
                            onClick={() => onApprove?.(member.id)}
                          >
                            <FaCheck className="fill-white mr-1" />
                            <span>Approve</span>
                          </button>
                          <button
                            className="flex-1 flex items-center justify-center space-x-1 text-xs text-white bg-red-600 p-2 rounded-sm"
                            onClick={() => onDisapprove?.(member.id)}
                          >
                            <ImCross className="fill-white mr-1" />
                            <span>Disapprove</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Speciality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Date Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Ads Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-300 dark:divide-gray-800">
              {paginatedMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">
                      <p>{member.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 block md:hidden">
                        {member.speciality}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 hidden md:table-cell">
                    {member.speciality}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                    {new Date(member.dateAdded).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        member.status === "Active"
                          ? "dark:bg-green-900/30 bg-green-600 text-white dark:text-green-400"
                          : member.status === "Pending"
                            ? "dark:bg-yellow-900/30 bg-yellow-400 text-black dark:text-yellow-400"
                            : "dark:bg-gray-900/30 bg-gray-600 text-white dark:text-gray-400"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-4">
                      <button onClick={() => onPreview(member.id)}>
                        <FaEye className="w-5 h-5 fill-yellow-500 hover:bg-gray-700" />
                      </button>
                      <button onClick={() => onEdit(member.id)}>
                        <FaEdit className="w-5 h-5 fill-purple-500 hover:bg-gray-700" />
                      </button>
                      <button onClick={() => onDownload(member.id)}>
                        <FaDownload className="w-5 h-5 fill-blue-500 hover:bg-gray-700" />
                      </button>
                      {approvalState && (
                        <>
                          {member.approvalStatus === "approved" ? (
                            <>
                              <span className="text-xs text-green-600 font-semibold">
                                ✅ Approved
                              </span>
                              <button onClick={() => onDisapprove?.(member.id)}>
                                <ImCross className="fill-red-500 h-5 w-5 hover:bg-gray-700 ml-2" />
                              </button>
                            </>
                          ) : member.approvalStatus === "disapproved" ? (
                            <>
                              <span className="text-xs text-red-600 font-semibold">
                                ❌ Disapproved
                              </span>
                              <button onClick={() => onApprove?.(member.id)}>
                                <FaCheck className="fill-green-500 h-5 w-5 hover:bg-gray-700 ml-2" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => onApprove?.(member.id)}>
                                <FaCheck className="fill-green-500 h-5 w-5 hover:bg-gray-700" />
                              </button>
                              <button onClick={() => onDisapprove?.(member.id)}>
                                <ImCross className="fill-red-500 h-5 w-5 hover:bg-gray-700" />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === idx + 1
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Empty state */}
      {filteredMembers.length === 0 && (
        <div className="mt-6 text-center text-gray-400">
          <FaFilm className="text-4xl mx-auto mb-2" />
          <p>No members match your search.</p>
        </div>
      )}
    </div>
  );
};

export default MemberTable;

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const Pagination = ({ currentPage = 0, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="d-flex justify-content-center mt-5">
      <ul className="pagination rounded-0 gap-1 border-0">
        {/* Previous Button */}
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="page-link border rounded-0 text-dark bg-white py-2 px-3 d-flex align-items-center justify-content-center"
            disabled={currentPage === 0}
            type="button"
          >
            <FaChevronLeft size={10} />
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((p) => (
          <li key={p} className={`page-item ${currentPage === p ? 'active' : ''}`}>
            <button
              onClick={() => onPageChange(p)}
              className={`page-link border rounded-0 py-2 px-3 fs-7 font-weight-bold ${
                currentPage === p 
                  ? 'bg-ajio-red border-ajio-red text-white' 
                  : 'bg-white text-dark hover-bg-light-gray'
              }`}
              type="button"
            >
              {p + 1}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="page-link border rounded-0 text-dark bg-white py-2 px-3 d-flex align-items-center justify-content-center"
            disabled={currentPage === totalPages - 1}
            type="button"
          >
            <FaChevronRight size={10} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

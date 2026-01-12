'use client';
import { get, isEmpty } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import * as XLSX from 'xlsx';
import { groupDataByCategory } from './utils';
import BoxedContainer from '../layout/boxed-container';
import GeneratedTable from '../GeneratedTable/GeneratedTable';
import Button from '../layout/button';
import ChecklistModal from './ChecklistModal';

const ChecklistBlock = ({ data, lang }) => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Extract data properties
  const file = get(data, 'properties.file[0].url', '');
  const checklistTitle = get(data, 'properties.checkListTitle', '');
  const checklistSubtitle = get(data, 'properties.checkListTitle', '');
  const title = get(data, 'properties.title', '');
  const warrantyTable = get(data, 'properties.warranty', '');
  const warrantyTitle = get(data, 'properties.warrantyTitle', '');

  const conditionTitle = get(data, 'properties.conditionTitle', '');
  const conditionTable = get(data, 'properties.conditionTable', []);

  const illustration = get(data, 'properties.illustration[0].url', '');

  const historyTitle = get(data, 'properties.historyTitle', '');
  const historySubtitle = get(data, 'properties.historySubtitle.markup', '');
  const historyTable = get(data, 'properties.historyTable', []);
  const caption = get(data, 'properties.caption', '');

  const modalTitle = get(data, 'properties.modalTitle', '');
  const modalSubtitle = get(data, 'properties.modalSubtitle.markup', '');

  const buttonLabel = get(data, 'properties.buttonLabel', '');

  const infoTitle = get(data, 'properties.infoTitle', '');
  const infoTable = get(data, 'properties.infoTable', []);

  const subtitle = get(data, 'properties.subtitle.markup', '');
  const checklistFile = `${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}${file}`;
  const fetchAndParseExcel = async () => {
    if (!checklistFile || !file) return;

    try {
      setLoading(true);
      setError(null);

      const proxyUrl = `/api/proxy-excel?url=${encodeURIComponent(checklistFile)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch Excel file');
      }

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const lastSheetName = workbook.SheetNames[workbook.SheetNames.length - 1];
      const worksheet = workbook.Sheets[lastSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const grouped = groupDataByCategory(jsonData);
      setGroupedData(grouped);
    } catch (err) {
      console.error('Error fetching Excel data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndParseExcel();
  }, [checklistFile, file]);

  return (
    <section className="bg-white pt-15 font-noto text-clamp12to15 leading-[24px] text-primary md:pt-20">
      <BoxedContainer>
        {!isEmpty(title) && (
          <h2 className="mb-8 text-center text-clamp18to28 font-bold">{title}</h2>
        )}

        {!isEmpty(subtitle) && (
          <p
            className="mb-6 text-center text-clamp16to18 lg:mb-12"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}

        {!isEmpty(warrantyTable) && (
          <div className="mb-8 lg:mb-12">
            <GeneratedTable table={warrantyTable} />
          </div>
        )}

        <div className="mx-auto w-fit">
          <Button clickHandler={() => setShowModal(true)} variant="primaryJD" label={buttonLabel} />
        </div>
      </BoxedContainer>

      <ChecklistModal
        warrantyTable={warrantyTable}
        warrantyTitle={warrantyTitle}
        isOpen={showModal && !loading}
        onClose={() => setShowModal(false)}
        groupedData={groupedData}
        checklistSubtitle={checklistSubtitle}
        checklistTitle={checklistTitle}
        conditionTitle={conditionTitle}
        conditionTable={conditionTable}
        historySubtitle={historySubtitle}
        historyTable={historyTable}
        historyTitle={historyTitle}
        caption={caption}
        modalSubtitle={modalSubtitle}
        modalTitle={modalTitle}
        illustration={illustration}
        infoTitle={infoTitle}
        infoTable={infoTable}
      />
    </section>
  );
};

// Loading component
const LoadingSpinner = ({ message }) => (
  <div className="flex items-center justify-center p-8">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
    <span className="ml-3 text-gray-600">{message}</span>
  </div>
);

// Error component
const ErrorMessage = ({ message }) => (
  <div className="m-4 rounded-lg border border-red-200 p-4">
    <div className="flex items-center">
      <div className="text-red-600">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span className="ml-2 font-medium text-red-800">Error loading checklist:</span>
    </div>
    <p className="mt-1 text-red-700">{message}</p>
  </div>
);

export default ChecklistBlock;

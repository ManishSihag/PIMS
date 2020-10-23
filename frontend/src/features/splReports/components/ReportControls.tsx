import * as React from 'react';
import { Formik, Form } from 'formik';
import { Input, Button, Check, SelectOption } from 'components/common/form';
import ResetButton from 'components/common/form/ResetButton';
import { FaFileExcel, FaFileAlt } from 'react-icons/fa';
import { Row, Form as BSForm } from 'react-bootstrap';
import { IReport } from '../interfaces';
import _ from 'lodash';
import { formatApiDateTime, generateUtcNowDateTime } from 'utils';
import styled from 'styled-components';
import { Prompt } from 'react-router-dom';

interface IReportControlsProps {
  /** the active report being displayed, snapshot data is displayed based on this report */
  currentReport?: IReport;
  /** a full list of spl reports in the system */
  reports: IReport[];
  /** the action to take if a report is saved */
  onSave: (report: IReport) => void;
  /** the action to take if a report's 'To' date is updated to the current date/time */
  onRefresh: (report: IReport) => void;
  /** the action to take if a report's 'From' date is updated to point to a different, older spl report. */
  onFromChange: (reportId: number) => void;
  /** the action to take if a user clicks one of the export icons. */
  onExport: (report: IReport, accept: 'csv' | 'excel') => void;
}

/** This object will be used to initialize new spl reports. */
export const defaultReport: IReport = {
  name: '',
  reportTypeId: 0,
  isFinal: false,
  to: generateUtcNowDateTime(),
};

/** get all of the other reports that have a 'To' date before this date */
const getOtherOlderReports = (reports: IReport[], currentReport?: IReport) => {
  return currentReport !== undefined
    ? _.filter(
        reports,
        report => !!report.id && report.id !== currentReport.id && currentReport.to > report.to,
      )
    : [];
};

const FileIcon = styled(Button)`
  background-color: white !important;
  color: #003366 !important;
  padding: 6px 5px;
`;

/**
 * return a list of SelectOptions based on the passed reports, only returning dates older then the current report.
 */
const reportsToOptions = (reports: IReport[]) => {
  const options = _.map(
    reports,
    (report: IReport) =>
      ({
        value: report.id,
        label: report.name?.length ? report.name : formatApiDateTime(report.to),
      } as SelectOption),
  );
  options.unshift({
    value: '',
    label: 'Choose a report',
  });
  return options;
};

/**
 * Formik based Report Controls. Maintains independent state from the SplReportContainer. However, the formik container accepts initial state from the SplReportContainer.
 */
const ReportControls: React.FunctionComponent<IReportControlsProps> = ({
  reports,
  currentReport,
  onSave,
  onRefresh,
  onFromChange,
  onExport,
}) => {
  const otherReports = getOtherOlderReports(reports, currentReport);
  const reportOptions = reportsToOptions(otherReports);
  let reportOn = formatApiDateTime(currentReport?.to);
  const fromId = _.find(reports, { to: currentReport?.from })?.id;
  return currentReport ? (
    <Formik
      initialValues={{ ...defaultReport, ...currentReport }}
      onSubmit={values => onSave(values)}
      enableReinitialize
    >
      {({ dirty, values }) => (
        <>
          <Form className="report-form">
            <Row noGutters className="d-flex align-items-center">
              {reportOptions.length > 1 ? (
                <BSForm.Group>
                  <BSForm.Control
                    label="From: "
                    options={reportOptions}
                    as="select"
                    value={fromId}
                    disabled={values.isFinal}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      onFromChange(+e.target.value)
                    }
                  >
                    {reportOptions.map((option: SelectOption) => (
                      <option key={option.value} value={option.value} className="option">
                        {option.label}
                      </option>
                    ))}
                  </BSForm.Control>
                </BSForm.Group>
              ) : (
                <BSForm.Group>
                  <BSForm.Label>From: N/A</BSForm.Label>
                </BSForm.Group>
              )}
              <BSForm.Group className="h-75">
                <BSForm.Label>To:</BSForm.Label>
                <BSForm.Control type="input" disabled value={reportOn}></BSForm.Control>
              </BSForm.Group>
              <ResetButton
                disabled={values.isFinal}
                onClick={() => onRefresh(currentReport)}
                className="mr-3"
              />
              <Input label="Name:" field="name" disabled={values.isFinal} />
              <Check label="Is Final:" field="isFinal" />
              <Button className="h-75 mr-auto" type="submit" disabled={!dirty}>
                Save
              </Button>
              <FileIcon>
                <FaFileExcel size={36} onClick={() => onExport(currentReport, 'excel')} />
              </FileIcon>
              <FileIcon>
                <FaFileAlt size={36} onClick={() => onExport(currentReport, 'csv')} />
              </FileIcon>
            </Row>
          </Form>
          <Prompt
            when={dirty}
            message="You have unsaved changes, are you sure you want to leave? Your unsaved changes will be lost."
          />
        </>
      )}
    </Formik>
  ) : (
    <p>Please Create or Select a Report</p>
  );
};

export default ReportControls;
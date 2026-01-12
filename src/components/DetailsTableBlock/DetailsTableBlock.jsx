import React from 'react';
import _ from 'lodash'; // Missing import
import BoxedContainer from '../layout/boxed-container';
import { isEmpty } from 'lodash';
import GeneratedTable from '../GeneratedTable/GeneratedTable';

export default function DetailsTableBlock({ data }) {
  const enginTitle = _.get(data, 'properties.enginTitle', '');
  const enginTable = _.get(data, 'properties.enginTable', {});

  const sizeTitle = _.get(data, 'properties.sizeTitle', '');
  const sizeTable = _.get(data, 'properties.sizeTable', {});

  const drivingTitle = _.get(data, 'properties.drivingTitle', '');
  const drivingTable = _.get(data, 'properties.drivingTable', {});

  const ptoTitle = _.get(data, 'properties.ptoTitle', '');
  const ptoTable = _.get(data, 'properties.ptoTable', {});

  return (
    <div className="mt-15 lg:mt-20">
      <BoxedContainer>
        <div className="space-y-12 lg:space-y-12">
          <div>{!isEmpty(ptoTable) && <GeneratedTable table={ptoTable} />}</div>
          <div>{!isEmpty(sizeTable) && <GeneratedTable table={sizeTable} />}</div>
          <div>{!isEmpty(drivingTable) && <GeneratedTable table={drivingTable} />}</div>
        </div>
      </BoxedContainer>
    </div>
  );
}

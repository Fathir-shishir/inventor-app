import React from 'react'

const ProgressBar = ({ kanban }) => {
  const createProgressBar = () => {
    if (!kanban.batch_size) return <div className="bg-gray-100 h-full w-full" />;
    const bars = [];

    [...new Array(Math.ceil(kanban.produced / kanban.parts_per_container)).keys()].map(e => bars.push(<div className="bg-[#82e600] h-full w-full" key={`produced-${e}`} />));
    [...new Array(Math.ceil((kanban.batch_size - kanban.produced) / kanban.parts_per_container)).keys()].map(e => bars.push(<div className="bg-gray-100 h-full w-full" key={`non-produced-${e}`} />));
    return bars;
  }

  return (
    <div className="flex flex-col">
      <span className="self-center text-xl mb-1">{kanban.produced} / {kanban.batch_size}</span>
      <div className={`h-8 w-full flex flex-row ${kanban.parts_per_container > 10 ? "gap-1" : ""} px-5`}>
        {createProgressBar()}
      </div>
    </div>
  )
}

export default ProgressBar
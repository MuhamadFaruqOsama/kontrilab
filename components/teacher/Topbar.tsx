"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Notification03Icon } from "@hugeicons/core-free-icons";

export default function Topbar() {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="w-full max-w-md relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-default-500">
          <HugeiconsIcon icon={Search01Icon} size={18} />
        </span>
        <input
          type="search"
          placeholder="Cari proyek, siswa, atau kelas"
          className="w-full rounded-lg border border-default-200 bg-transparent py-2 pl-9 pr-12 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-10"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center rounded-sm bg-default-100 px-1.5 py-0.5 text-tiny font-medium text-default-500">
          Ctrl F
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button className="relative inline-flex items-center justify-center rounded-full h-10 w-10 text-default-500 hover:bg-default-100 transition-colors">
          <HugeiconsIcon icon={Notification03Icon} size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger"></span>
        </button>

        <div className="h-8 w-8 overflow-hidden rounded-full cursor-pointer ring-2 ring-transparent hover:ring-default-200 transition-all">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User avatar" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

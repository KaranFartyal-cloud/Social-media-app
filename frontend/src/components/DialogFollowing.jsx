import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const DialogFollowing = ({ open, setOpen, following }) => {
  console.log(following);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[300px] w-[500px] p-3">
        <div>
          <div className="flex justify-center items-center">
            <span>Following</span>
          </div>

          <div className="flex flex-col items-center mt-2">
            <input
              type="text"
              placeholder="search"
              className="focus:outline-none border w-[90%] p-1 rounded-lg  bg-[#EFEFEF]" ///start from here
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogFollowing;

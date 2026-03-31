import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Search,
  MoreVertical,
  Eye,
  Ban,
  Trash2,
  CheckCircle,
  Key,
} from "lucide-react";

import axios from "axios";
import { API_BASE_URL } from "../apihelper.ts";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const admintoken = localStorage.getItem("admintoken");

  const fetchUsers = async () => {
    try {
      const usersRes = await axios.get(
        `${API_BASE_URL}/api/admin/users/getAllUsers`,
        { headers: { Authorization: `Bearer ${admintoken}` } }
      );

      // console.log("user response", usersRes)

      if (usersRes.data.status) {
        setUsers(usersRes.data.data);
      }
    } catch (error) {
      toast.error("failed to fetch the users");
    }
  };

  useEffect(() => {
    if (!admintoken) {
      return;
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockUser = async (userId: string) => {
    console.log(userId);
    try {
      const blockRes = await axios.put(
        `${API_BASE_URL}/api/admin/users/toggleBlockUser/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${admintoken}` } }
      );

      // console.log("block response :", blockRes)

      toast.success(blockRes.data.message || "user status updated");
      fetchUsers();
    } catch (error) {
      toast.error("failed to update the user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const deleteRes = await axios.delete(
        `${API_BASE_URL}/api/admin/users/deleteUser/${userId}`,
        { headers: { Authorization: `Bearer ${admintoken}` } }
      );
      // console.log("delete response", deleteRes)
      toast.success(deleteRes.data.message || "user deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("failed to delete the user");
    }
  };

  const handleViewDetails = async (userId: string) => {
    try {
      const viewRes = await axios.get(
        `${API_BASE_URL}/api/admin/users/getUserById/${userId}`,
        { headers: { Authorization: `Bearer ${admintoken}` } }
      );

      console.log("view response : ", viewRes.data.data);
      if (viewRes.data.status) {
        setSelectedUser(viewRes.data.data);
        toast.success(viewRes.data.message || "User details fetch ");
        setIsDetailsOpen(true);
      }
    } catch (error) {
      toast.error("failed to show the details of the user");
    }
  };

  const columns = [
    {
      key: "fullName",
      header: "Name",
      render: (user) => (
        <div>
          <p className="font-medium">{user.fullName}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      header: "Phone",
      render: (user) => (user.phoneNumber ? user.phoneNumber : "N/A"),
    },
    {
      key: "age",
      header: "Age",
    },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <span className="rounded bg-muted px-2 py-1 text-xs">{user.role}</span>
      ),
    },
    {
      key: "isBlocked",
      header: "Status",
      render: (user) =>
        user.isBlocked ? (
          <span className="text-red-500 font-medium">Blocked</span>
        ) : (
          <span className="text-green-500 font-medium">Active</span>
        ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(user._id)}
            className="px-3 py-1 text-xs rounded bg-blue-500 text-white"
          >
            View details
          </button>

          <button
            onClick={() => handleBlockUser(user._id)}
            className={`px-3 py-1 text-xs rounded ${
              user.isBlocked
                ? "bg-green-500 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            {user.isBlocked ? "Unblock" : "Block"}
          </button>

          <button
            onClick={() => handleDeleteUser(user._id)}
            className="px-3 py-1 text-xs rounded bg-red-500 text-white"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Users" description="Manage your customer accounts" />

      {/* Search */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        keyExtractor={(user) => user._id}
      />

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about this user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p>{selectedUser.fullName}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p>{selectedUser.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Age
                  </p>
                  <p>{selectedUser.age}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Role
                  </p>
                  <p>{selectedUser.role}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p>{selectedUser.isBlocked ? "Blocked" : "Active"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Joined
                  </p>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

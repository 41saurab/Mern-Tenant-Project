import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authSvc } from "../auth/auth-service";
import { CardSkeletonComponent } from "@/component/skeleton/skeleton";
import { PageHeaderComponent } from "@/component/page-header-component";
import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { reviewSvc } from "./landlord-review-service";

const AllLandlordsList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [ratings, setRatings] = useState({});

    const loadRating = async () => {
        try {
            const response = await reviewSvc.getRating();
            console.log(response);

            if (response.data.length > 0) {
                // Loop through the response and create a mapping of landlordId to averageRating
                const landlordRatings = response.data.reduce((acc, { landlordId, averageRating }) => {
                    acc[landlordId] = averageRating; // Store averageRating instead of rate
                    return acc;
                }, {});

                // Set the ratings in the state
                setRatings(landlordRatings);
            }
        } catch (error) {}
    };

    const getUsers = async () => {
        setLoading(true);
        try {
            const response = await authSvc.getLandlords();

            setUsers(response.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
        loadRating();
    }, []);

    // Sort users based on ratings (high to low)
    const sortedUsers = users
        .map((landlord) => {
            const landlordRating = ratings[landlord._id] || 0; // Default to 0 if no rating exists
            return { ...landlord, rating: landlordRating };
        })
        .sort((a, b) => b.rating - a.rating); // Sort by rating in descending order

    return (
        <div className="flex w-full min-h-screen justify-center bg-gray-50 dark:bg-gray-900 py-6 px-4">
            <div>
                <PageHeaderComponent label={"Landlords"} />
                <div className="p-6">
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loading ? (
                            <CardSkeletonComponent rows={1} cols={4} />
                        ) : sortedUsers.length > 0 ? (
                            sortedUsers.map((landlord) => {
                                return (
                                    <NavLink key={landlord._id} to={`/landlord/${landlord.slug}`}>
                                        <Card className="w-[290px] relative">
                                            {landlord.rating > 0 ? (
                                                <>
                                                    <Badge className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white rounded-md shadow-md text-xs" variant="destructive">
                                                        Rating: {landlord.rating}
                                                    </Badge>
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                            <CardHeader className="flex flex-col items-center space-y-3">
                                                <Avatar className="w-16 h-16">
                                                    <AvatarImage src={landlord.image} alt={`${landlord.fullName}'s profile`} className="object-cover" />
                                                    <AvatarFallback>{landlord.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="text-center">
                                                    <CardTitle className="text-lg font-semibold">{landlord.fullName}</CardTitle>
                                                    <CardDescription className="text-sm">{landlord.email}</CardDescription>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Phone:</span>
                                                        <span>{landlord.phoneNumber}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <NavLink to={`/landlord/${landlord.slug}`} className="w-full">
                                                    <Button className="w-full">View Profile</Button>
                                                </NavLink>
                                            </CardFooter>
                                        </Card>
                                    </NavLink>
                                );
                            })
                        ) : (
                            <>No landlords</>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllLandlordsList;

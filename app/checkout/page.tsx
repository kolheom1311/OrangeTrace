"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { indianStatesAndCities } from "@/lib/indianStatesAndCities";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Shield,
  CreditCard,
  ArrowLeft,
  Smartphone,
  Banknote,
  Lock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { CartItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const states = Object.keys(indianStatesAndCities);

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const paymentMethods = [
    { id: "online", name: "Online Payment", icon: Smartphone },
    { id: "cod", name: "Cash on Delivery", icon: Banknote },
  ];

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      setError("Please log in to proceed to checkout.");
      return;
    }

    const loadCheckoutItems = async () => {
      setIsLoading(true);
      try {
        const buyNowData = localStorage.getItem("checkoutItems");

        if (buyNowData) {
          const items = JSON.parse(buyNowData) as CartItem[];
          if (items && items.length > 0) {
            setCartItems(items);
            localStorage.removeItem("checkoutItems");
          } else {
            router.push("/marketplace");
          }
        } else {
          const response = await fetch("/api/cart", {
            headers: { "x-user-id": user.id },
          });
          if (!response.ok) throw new Error("Failed to load your cart.");
          const data = await response.json();

          if (data.length === 0) {
            toast.info("Your cart is empty. Add items to checkout.");
            router.push("/cart");
          } else {
            setCartItems(data);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCheckoutItems();
  }, [user, router]);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [id]: value }));
  };

  const handleStateChange = (state: string) => {
    setDeliveryAddress((prev) => ({ ...prev, state: state, city: "" })); // Reset city on state change
    setAvailableCities(
      indianStatesAndCities[state as keyof typeof indianStatesAndCities] || []
    );
  };

  const handleCityChange = (city: string) => {
    setDeliveryAddress((prev) => ({ ...prev, city: city }));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.pricePerKg * item.selectedQuantity,
    0
  );
  const deliveryFee = subtotal > 1000 ? 0 : 50;
  const total = subtotal + deliveryFee;

  // const handlePayment = async () => {
  //   if (!user) {
  //     toast.error("You must be logged in to place an order.");
  //     return;
  //   }
  //   for (const key in deliveryAddress) {
  //     if (!deliveryAddress[key as keyof typeof deliveryAddress]) {
  //       toast.error("Please fill out all address fields.");
  //       return;
  //     }
  //   }

  //   setIsPlacingOrder(true);

  //   try {
  //     const orderResponse = await fetch("/api/razorpay", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ amount: total, currency: "INR" }),
  //     });

  //     if (!orderResponse.ok)
  //       throw new Error("Failed to create Razorpay order.");

  //     const orderData = await orderResponse.json();

  //     const options = {
  //       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //       amount: orderData.amount,
  //       currency: orderData.currency,
  //       name: "OrangeTrace",
  //       description: "Fresh Oranges Purchase",
  //       order_id: orderData.id,
  //       handler: async function (response: any) {
  //         const finalOrderResponse = await fetch("/api/orders", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             "x-user-id": user.id,
  //           },
  //           body: JSON.stringify({
  //             deliveryAddress,
  //             cartItems,
  //             total,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_signature: response.razorpay_signature,
  //           }),
  //         });

  //         if (!finalOrderResponse.ok) {
  //           const errorData = await finalOrderResponse.json();
  //           throw new Error(
  //             errorData.error || "Failed to save order after payment."
  //           );
  //         }

  //         const { orderId } = await finalOrderResponse.json();
  //         const inventoryResponse = await fetch("/api/update-inventory", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             "x-user-id": user.id,
  //           },
  //           body: JSON.stringify({ cartItems }),
  //         });
  //         if (!inventoryResponse.ok) {
  //           const invError = await inventoryResponse.json();
  //           console.error("Inventory update failed:", invError.error);
  //           toast.error(
  //             "Order placed but inventory update failed. Please contact support."
  //           );
  //         } else {
  //           toast.success("Payment successful! Order placed.");
  //         }
  //         router.push(`/order-success?orderId=${orderId}`);
  //       },
  //       prefill: {
  //         name: deliveryAddress.fullName,
  //         email: user.email,
  //         contact: deliveryAddress.phone,
  //       },
  //       theme: {
  //         color: "#F97316",
  //       },
  //     };

  //     if (!window.Razorpay) {
  //       toast.error(
  //         "Payment gateway is not loaded. Please refresh and try again."
  //       );
  //       setIsPlacingOrder(false);
  //       return;
  //     }

  //     const paymentObject = new window.Razorpay(options);
  //     paymentObject.open();
  //     paymentObject.on("payment.failed", function (response: any) {
  //       toast.error(`Payment failed: ${response.error.description}`);
  //       setIsPlacingOrder(false);
  //     });
  //   } catch (err) {
  //     toast.error(
  //       err instanceof Error ? err.message : "An unknown error occurred."
  //     );
  //     setIsPlacingOrder(false);
  //   }
  // };

  const handlePayment = async () => {
    if (!user) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    // Validate all address fields are filled
    for (const key in deliveryAddress) {
      if (!deliveryAddress[key as keyof typeof deliveryAddress]) {
        toast.error("Please fill out all address fields.");
        return;
      }
    }

    // Validate payment method is selected
    if (!selectedPayment) {
      toast.error("Please select a payment method.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Handle Cash on Delivery
      if (selectedPayment === "cod") {
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({
            deliveryAddress,
            cartItems,
            total,
            paymentMethod: "cod",
            paymentStatus: "pending",
          }),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          throw new Error(errorData.error || "Failed to place order.");
        }

        const { orderId } = await orderResponse.json();

        // Update inventory
        const inventoryResponse = await fetch("/api/update-inventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({ cartItems }),
        });

        if (!inventoryResponse.ok) {
          const invError = await inventoryResponse.json();
          console.error("Inventory update failed:", invError.error);
          toast.error(
            "Order placed but inventory update failed. Please contact support."
          );
        } else {
          toast.success("Order placed successfully! Pay on delivery.");
        }

        router.push(`/order-success?orderId=${orderId}`);
        return;
      }

      // Handle Online Payment (Razorpay)
      if (selectedPayment === "online") {
        const orderResponse = await fetch("/api/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total, currency: "INR" }),
        });

        if (!orderResponse.ok)
          throw new Error("Failed to create Razorpay order.");

        const orderData = await orderResponse.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "OrangeTrace",
          description: "Fresh Oranges Purchase",
          order_id: orderData.id,
          handler: async function (response: any) {
            const finalOrderResponse = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-user-id": user.id,
              },
              body: JSON.stringify({
                deliveryAddress,
                cartItems,
                total,
                paymentMethod: "online",
                paymentStatus: "completed",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!finalOrderResponse.ok) {
              const errorData = await finalOrderResponse.json();
              throw new Error(
                errorData.error || "Failed to save order after payment."
              );
            }

            const { orderId } = await finalOrderResponse.json();

            // Update inventory
            const inventoryResponse = await fetch("/api/update-inventory", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-user-id": user.id,
              },
              body: JSON.stringify({ cartItems }),
            });

            if (!inventoryResponse.ok) {
              const invError = await inventoryResponse.json();
              console.error("Inventory update failed:", invError.error);
              toast.error(
                "Order placed but inventory update failed. Please contact support."
              );
            } else {
              toast.success("Payment successful! Order placed.");
            }

            router.push(`/order-success?orderId=${orderId}`);
          },
          prefill: {
            name: deliveryAddress.fullName,
            email: user.email,
            contact: deliveryAddress.phone,
          },
          theme: {
            color: "#F97316",
          },
        };

        if (!window.Razorpay) {
          toast.error(
            "Payment gateway is not loaded. Please refresh and try again."
          );
          setIsPlacingOrder(false);
          return;
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response: any) {
          toast.error(`Payment failed: ${response.error.description}`);
          setIsPlacingOrder(false);
        });
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
      setIsPlacingOrder(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-destructive">{error}</h2>
        <Button asChild className="mt-6">
          <Link href="/cart">Back to Cart</Link>
        </Button>
      </div>
    );

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={deliveryAddress.fullName}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={deliveryAddress.phone}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={deliveryAddress.address}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select
                        onValueChange={handleStateChange}
                        value={deliveryAddress.state}
                        required
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select
                        onValueChange={handleCityChange}
                        value={deliveryAddress.city}
                        disabled={!deliveryAddress.state}
                        required
                      >
                        <SelectTrigger id="city">
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        value={deliveryAddress.pincode}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <Label
                        key={method.id}
                        htmlFor={method.id}
                        className="flex items-center space-x-3 p-4 border rounded-lg has-[:checked]:bg-accent has-[:checked]:border-primary transition-all cursor-pointer"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <method.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{method.name}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img
                        src={
                          item.image ||
                          "https://placehold.co/64x64/f97316/white?text=O"
                        }
                        alt={item.variety}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.variety}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.selectedQuantity} kg
                        </p>
                      </div>
                      <p className="font-medium">
                        ₹
                        {(
                          item.pricePerKg * item.selectedQuantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-green-600">
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Button
                size="lg"
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={handlePayment}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                {isPlacingOrder
                  ? "Processing..."
                  : `Pay Securely - ₹${total.toLocaleString()}`}
              </Button>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-green-600" />
                  <p className="text-sm text-muted-foreground">
                    Your payment is encrypted and your purchase is protected by
                    Razorpay.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

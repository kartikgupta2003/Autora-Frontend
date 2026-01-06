import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider"

const EmiCalculator = ({ price = 1000 }) => {
    const [carPrice, setCarPrice] = useState([price]);
    const [downPayment, setDownPayment] = useState([0]);
    const [interestRate, setInterestRate] = useState([4.5]);
    const [loanTerm, setLoanTerm] = useState([5]);
    const [emi, setEmi] = useState(0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(amount);
    };

    useEffect(() => {
        const loan = carPrice[0] - downPayment[0];
        if (loan <= 0) {
            setEmi(0);
            return;
        }
        const monthlyRate = interestRate[0] / (1200);
        const months = loanTerm[0] * 12;
        const estimatedEmi = (loan * monthlyRate * Math.pow((1 + monthlyRate), months)) / (Math.pow((1 + monthlyRate), months) - 1);
        setEmi(estimatedEmi);

    }, [carPrice, downPayment, interestRate, loanTerm]);

    return (
        <div className="w-full max-h-[80vh] overflow-y-auto pr-1">
            <div className="w-full">
                <div className="flex items-center mb-6">
                    <i className="fas fa-car text-gray-900 dark:text-white text-2xl mr-3"></i>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <h2 className="text-lg font-inter font-semibold text-gray-900 dark:text-white mb-3">
                            Vehicle Price
                        </h2>
                        <div className="space-y-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-700 dark:text-gray-300">$</span>
                                </div>
                                <input
                                    type="number"
                                    value={carPrice[0]}
                                    onChange={(e) =>
                                        setCarPrice([parseFloat(e.target.value)])
                                    }
                                    className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-gray-400"
                                />
                            </div>
                            {/* <input
                                type="range"
                                min="1000"
                                max="150000"
                                value={loanAmount}
                                onChange={(e) =>
                                    handleLoanAmountChange(parseFloat(e.target.value))
                                }
                                className="w-full"
                            /> */}
                            <Slider
                                max={price}
                                step={100}
                                value={carPrice}
                                onValueChange={(value) => setCarPrice(value)} />
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <h2 className="text-lg font-inter font-semibold text-gray-900 dark:text-white mb-3">
                            Down Payment
                        </h2>
                        <div className="space-y-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-700 dark:text-gray-300">$</span>
                                </div>
                                <input
                                    type="number"
                                    value={downPayment[0]}
                                    onChange={(e) =>
                                        setDownPayment([parseFloat(e.target.value)])
                                    }
                                    className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-gray-400"
                                />
                            </div>
                            <Slider
                                max={price}
                                step={100}
                                value={downPayment}
                                onValueChange={(value) => setDownPayment([value])} />
                            {/* <div className="text-sm text-gray-600 dark:text-gray-400">
                                Down payment: {downPaymentPercent.toFixed(1)}% of vehicle price
                            </div> */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                            <h2 className="text-lg font-inter font-semibold text-gray-900 dark:text-white mb-3">
                                Interest Rate
                            </h2>
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={interestRate[0]}
                                        onChange={(e) =>
                                            setInterestRate([parseFloat(e.target.value)])
                                        }
                                        className="w-full pr-8 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-gray-400"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-700 dark:text-gray-300">%</span>
                                    </div>
                                </div>
                                <Slider
                                max={20}
                                step={0.5}
                                value={interestRate}
                                onValueChange={(value) => setInterestRate([value])} />
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                            <h2 className="text-lg font-inter font-semibold text-gray-900 dark:text-white mb-3">
                                Loan Term
                            </h2>
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={loanTerm[0]}
                                        onChange={(e) =>
                                            setLoanTerm([parseFloat(e.target.value)])
                                        }
                                        className="w-full pr-12 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-gray-400"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Years
                                        </span>
                                    </div>
                                </div>
                                <Slider
                                max={5}
                                step={1}
                                value={loanTerm}
                                onValueChange={(value) => setLoanTerm([value])} />
                            </div>
                        </div>
                    </div>

                    {/* {error && (
                        <div className="text-red-500 dark:text-red-400 text-sm mt-3">
                            {error}
                        </div>
                    )} */}

                    {/* {results && ( */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mt-4">
                            <div className="text-center mb-4">
                                <div className="text-sm font-inter text-gray-700 dark:text-gray-300">
                                    Monthly Payment
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {formatCurrency(emi)}
                                </div>
                            </div>

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                                    <div className="text-sm font-inter text-gray-700 dark:text-gray-300">
                                        Vehicle Price
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                        ${formatNumber(carPrice)}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                                    <div className="text-sm font-inter text-gray-700 dark:text-gray-300">
                                        Down Payment
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                        ${formatNumber(results.downPayment)}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                                    <div className="text-sm font-inter text-gray-700 dark:text-gray-300">
                                        Loan Amount
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                        ${formatNumber(results.loanPrincipal)}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                                    <div className="text-sm font-inter text-gray-700 dark:text-gray-300">
                                        Total Interest
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                        ${formatNumber(results.totalInterest)}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg md:col-span-2">
                                    <div className="text-sm font-inter text-gray-700 dark:text-gray-300">
                                        Total Amount (Down Payment + Total Payments)
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                        $
                                        {formatNumber(
                                            parseFloat(results.downPayment) +
                                            parseFloat(results.totalPayment)
                                        )}
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    {/* )} */}

                    <p className="text-sm text-gray-700 dark:text-gray-300 text-center font-inter">
                        This is an estimate. Actual EMI may vary based on your credit score
                        and lender terms.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default EmiCalculator;